import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';
import { UserCredentials } from '../../../domain/entities/User';




export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}
  async execute(credentials: UserCredentials): Promise<string> {
    return await this.authRepository.login(credentials);
  }
}
