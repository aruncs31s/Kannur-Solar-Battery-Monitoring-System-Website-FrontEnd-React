import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class DeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: number): Promise<void> {
    return await this.userRepository.delete(id);
  }
}