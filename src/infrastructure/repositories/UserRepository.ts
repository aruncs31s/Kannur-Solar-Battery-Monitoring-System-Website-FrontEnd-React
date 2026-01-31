import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { httpClient } from '../http/HttpClient';

export class UserRepository implements IUserRepository {
  async getById(id: number): Promise<User> {
    const response = await httpClient.get<any>(`/users/${id}`);
    return {
      id: response.id.toString(),
      name: response.name,
      email: response.email,
      role: response.role || 'user'
    };
  }

  async getCurrent(): Promise<User> {
    // skvms doesn't have a /me endpoint, get from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    // For now, return a placeholder
    return {
      id: '1',
      name: 'Current User',
      email: 'user@example.com',
      role: 'user'
    };
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const response = await httpClient.put<any>(`/users/${id}`, {
      name: data.name,
      username: data.name,
      email: data.email,
      role: data.role
    });
    return {
      id: response.id.toString(),
      name: response.name,
      email: response.email || '',
      role: response.role || 'user'
    };
  }
}
