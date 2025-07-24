import { UserEntity } from '@/core/entities/User.entity';
import { IUserRepository } from '../repositories/IUserRepository';
import { CreateUserDto, userResponseDto } from '@/core/dtos/User.dto';

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

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userData: CreateUserDto): Promise<userResponseDto> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }
    const newUser = await this.userRepository.create(userData);
    return mapUserEntityToResponseDto(newUser);
  }
}