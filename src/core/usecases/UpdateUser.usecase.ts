
import { UserEntity } from '@/core/entities/User.entity';
import { IUserRepository } from "../repositories/IUserRepository";
import { UpdateUserDto, userResponseDto } from '@/core/dtos/User.dto';

function mapUserEntityToResponseDto(user: UserEntity): userResponseDto {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    isAdmin: user.isAdmin,
  };
}

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, updateData: Partial<UpdateUserDto>): Promise<userResponseDto> {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found.');
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithNewEmail = await this.userRepository.findByEmail(updateData.email);
      if (userWithNewEmail) {
        throw new Error('Another user with this email already exists.');
      }
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    return mapUserEntityToResponseDto(updatedUser);
  }
}