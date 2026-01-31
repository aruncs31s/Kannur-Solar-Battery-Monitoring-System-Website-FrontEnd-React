import { CreateUserDTO, User } from '../entities/User';

export interface IUserRepository {
  getById(id: number): Promise<User>;
  getCurrent(): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  getAll(): Promise<User[]>;
  create(data: Omit<CreateUserDTO, 'id'>): Promise<User>;
  delete(id: number): Promise<void>;
}
