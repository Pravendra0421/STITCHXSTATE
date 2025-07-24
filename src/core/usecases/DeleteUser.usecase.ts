import { IUserRepository } from "../repositories/IUserRepository";

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<boolean> {
    const userToDelete = await this.userRepository.findById(id);
    if (!userToDelete) {
      throw new Error('User not found.');
    }

    await this.userRepository.delete(id);
    return true;
  }
}