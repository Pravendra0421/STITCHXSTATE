import prisma from "@/lib/prisma";
import { UserEntity } from "../entities/User.entity";
import { CreateUserDto, UpdateUserDto, LoginResponseDto } from "../dtos/User.dto";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';



const JWT_SECRET = process.env.JWT_SECRET ;
const OTP_EXPIRY_MINUTES = 5; 

// otp valid for 5 minutes after five minutes it will expires
if (JWT_SECRET === null) {
  throw new Error("JWT_SECRET environment variable is not defined");
}
export interface IUserRepository {
    findAll(): Promise<UserEntity[]>;
    findById(id: string): Promise<UserEntity | null>;
    create(userData: CreateUserDto): Promise<UserEntity>;
    update(id: string, data: Partial<UpdateUserDto>): Promise<UserEntity>;
    delete(id: string): Promise<void>;
    findByEmail(email: string): Promise<UserEntity | null>;
    requestOtp(email: string): Promise<{ user: UserEntity, otp: string } | null>;
    verifyOtpAndLogin(email: string, otp: string): Promise<LoginResponseDto>;
}
export class PrismaUserRepository implements IUserRepository {
  private mapPrismaUserToUserEntity(prismaUser: Record<string, unknown>): UserEntity {
    return new UserEntity(
      prismaUser.id as string,
      prismaUser.firstName as string,
      prismaUser.lastName as string,
      prismaUser.email as string,
      prismaUser.password as string, // This is the HASHED password from the DB
      prismaUser.createdAt as Date,
      prismaUser.updatedAt as Date,
      prismaUser.isAdmin as boolean,
      (prismaUser.phone as string) || undefined,
      (prismaUser.otp as string) || null,
      (prismaUser.otpExpiresAt as Date) || null
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const prismaUsers = await prisma.user.findMany();
    return prismaUsers.map(u => this.mapPrismaUserToUserEntity(u as Record<string, unknown>));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
    });
    return prismaUser ? this.mapPrismaUserToUserEntity(prismaUser as Record<string, unknown>) : null;
  }

  async create(userData: CreateUserDto): Promise<UserEntity> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const createdPrismaUser = await prisma.user.create({
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        isAdmin: userData.isAdmin ?? false,
      },
    });
    return this.mapPrismaUserToUserEntity(createdPrismaUser as Record<string, unknown>);
  }

  async update(id: string, updateData: Partial<UpdateUserDto>): Promise<UserEntity> {
    const dataToUpdate: any = { ...updateData };

    if (updateData.password) {
      dataToUpdate.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedPrismaUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
    return this.mapPrismaUserToUserEntity(updatedPrismaUser as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });
    return prismaUser ? this.mapPrismaUserToUserEntity(prismaUser as Record<string, unknown>) : null;
    
  }

  async requestOtp(email: string): Promise<{ user: UserEntity, otp: string } | null> {
    let user = await this.findByEmail(email);// Try to find user
    if(!user){
      try{
        const newUserPrisma = await prisma.user.create({
          data:{
            email:email,
            isAdmin:false,
            firstName: '',
            lastName: '',
            password: '',
          },
        });
        user= this.mapPrismaUserToUserEntity(newUserPrisma as Record<string, unknown>);
      }catch {
        return null;
      }
    }
    const otp = Math.floor(100000+Math.random()*900000).toString();
    const otpExpiresAt = new Date(Date.now()+OTP_EXPIRY_MINUTES*60*1000);
    try {
      await prisma.user.update({
        where:{id:user.id},
        data:{
          otp:otp,
          otpExpiresAt:otpExpiresAt
        }
      });
      return { user, otp };
    } catch {
      return null;
    }
  }

  async verifyOtpAndLogin(email: string, otp: string): Promise<LoginResponseDto> {
      const user = await this.findByEmail(email);
      if (!user) {
        console.error(`User not found for email: ${email}`);
        throw new Error('Invalid email or OTP.');
    }
      //check the otp is valid or not
      if (!user.otp || !user.otpExpiresAt) {
        console.error(`OTP or expiry missing for user: ${email}`);
        throw new Error('Invalid email or OTP.');
    }
    if(user.otp !== otp){
        console.error(`Provided OTP '<span class="math-inline">\{otp\}' does not match stored OTP '</span>{user.otp}' for user: ${email}`);
        throw new Error('Invalid OTP');
    }
      //check if otp expired
      if(new Date()>user.otpExpiresAt){
        console.error(`OTP expired for user: ${email}. Current time: ${new Date()}, Expiry: ${user.otpExpiresAt}`);
        //clear the expired otp from the database for security reason
        await prisma.user.update({
          where:{id:user.id},
          data:{otp:null,otpExpiresAt:null},
        });
        throw new Error('otp has expired .please request a new one')
    }
      //otp is valid and not expired clear it form  the database after successful verification
      await prisma.user.update({
        where:{id:user.id},
        data:{otp:null,otpExpiresAt:null},
      });
       //  Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      },
      JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { user, token };
  }
}
  
  
