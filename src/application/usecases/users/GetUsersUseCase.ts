import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class GetUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.getAll();
  }
}