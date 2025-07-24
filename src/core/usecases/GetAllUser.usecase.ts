// src/core/usecases/GetAllUsers.usecase.ts

import { UserEntity } from '@/core/entities/User.entity';
import { userResponseDto } from '@/core/dtos/User.dto';
import { IUserRepository } from "../repositories/IUserRepository";

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

export class GetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<userResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map(mapUserEntityToResponseDto);
  }
}