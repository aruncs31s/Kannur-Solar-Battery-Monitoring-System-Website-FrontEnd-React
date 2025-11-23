import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { httpClient } from '../http/HttpClient';

export class UserRepository implements IUserRepository {
  async getById(id: number): Promise<User> {
    return await httpClient.get<User>(`/users/${id}`);
  }

  async getCurrent(): Promise<User> {
    return await httpClient.get<User>('/users/me');
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return await httpClient.put<User>(`/users/${id}`, data);
  }
}
