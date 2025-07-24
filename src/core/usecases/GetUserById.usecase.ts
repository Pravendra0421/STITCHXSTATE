// src/core/usecases/GetUserById.usecase.ts

import { UserEntity } from '@/core/entities/User.entity';
import { IUserRepository } from "../repositories/IUserRepository";
import { userResponseDto } from '@/core/dtos/User.dto';

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

export class GetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<userResponseDto | null> {
    const user = await this.userRepository.findById(id);
    return user ? mapUserEntityToResponseDto(user) : null;
  }
}