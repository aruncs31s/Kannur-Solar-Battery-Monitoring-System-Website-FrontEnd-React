// import { User } from '../../../domain/entities/User';
// import { IUserRepository } from '../../../domain/repositories/IUserRepository';

// export class CreateUserUseCase {
//   constructor(private userRepository: IUserRepository) {}

//   async execute(data: Omit<User, 'id'>): Promise<User> {
//     return await this.userRepository.create(data);
//   }
// }