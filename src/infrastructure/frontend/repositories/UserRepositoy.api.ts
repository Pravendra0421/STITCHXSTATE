// src/infrastructure/frontend/repositories/UserApiRepository.ts
'use client'
import { UserEntity } from '@/core/entities/User.entity';
import { IUserRepository } from '@/core/repositories/IUserRepository'; // Import from the combined file
import { CreateUserDto, LoginResponseDto, UpdateUserDto, userResponseDto ,RequestOtpDto,VerifyOtpDto} from '@/core/dtos/User.dto';

export class UserApiRepository implements IUserRepository {

  // Maps a UserResponseDto (from API) to UserEntity (for internal consistency)
  private mapResponseDtoToEntity(dto: userResponseDto): UserEntity {
    return new UserEntity(
      dto.id, dto.firstName, dto.lastName, dto.email,
      '', // Password is never returned by the API, so provide a placeholder
      dto.createdAt, dto.updatedAt, dto.isAdmin, dto.phone,undefined,undefined
    );
  }
  private async handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong with the API.');
  }
  return await response.json();
}


  async findAll(): Promise<UserEntity[]> {
    const response = await fetch('/api/users');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users from the API.');
    }
    const data: userResponseDto[] = await response.json();
    return data.map(this.mapResponseDtoToEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user by ID from the API.');
    }
    const data: userResponseDto = await response.json();
    return this.mapResponseDtoToEntity(data);
  }

  async create(userData: CreateUserDto): Promise<UserEntity> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An unknown error occurred while creating the user.');
    }

    const data: userResponseDto = await response.json();
    return this.mapResponseDtoToEntity(data);
  }

  async update(id: string, data: Partial<UpdateUserDto>): Promise<UserEntity> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user.');
    }
    const updatedUser: userResponseDto = await response.json();
    return this.mapResponseDtoToEntity(updatedUser);
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user.');
    }
  }

  // Note: This method's implementation might vary based on your API's capabilities.
  // A direct REST endpoint for findByEmail is less common than filtering a list.
  async findByEmail(email: string): Promise<UserEntity | null> {
    // This assumes your /api/users endpoint supports a query parameter for email
    const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to find user by email: ${email}`);
    }
    // Assuming the API returns an array of users matching the email (could be empty or contain one)
    const data: userResponseDto[] = await response.json();
    if (data.length > 0) {
      return this.mapResponseDtoToEntity(data[0]);
    }
    return null;
  }

// request an otp from the backend 
//call the post /api/auth/request-otp
async requestOtp(email: string): Promise<{ user: UserEntity, otp: string } | null> {
  const response = await fetch(`/api/users/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  // Read the response body once
  const result = await this.handleResponse<{ user: userResponseDto | null, otp?: string }>(response);

  // If user exists, map and return it
  if (result.user) {
    return { user: this.mapResponseDtoToEntity(result.user), otp: result.otp || '' };
  }

  // If no user but response is OK, return null or a success indicator
  if (response.ok) {
    return null; // Or return true to indicate success
  }

  // Throw error for non-OK responses
  throw new Error('Failed to request OTP');
}
async verifyOtpAndLogin(email:string,otp:string): Promise<LoginResponseDto> {
        const response = await fetch(`/api/users/verifyOtp`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email,otp}),
            credentials:'include'
        });
        return this.handleResponse<LoginResponseDto>(response);
    }
}