import { User } from '../entities/User';

export interface IUserRepository {
  getById(id: number): Promise<User>;
  getCurrent(): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
}
