import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserDTO, User } from '../../domain/entities/User';
import { httpClient } from '../http/HttpClient';

export class UserRepository implements IUserRepository {
  async getById(id: number): Promise<User> {
    const response = await httpClient.get<any>(`/users/${id}`);
    return {
      id: response.id.toString(),
      username: response.username,
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
    const response = await httpClient.get<any>('/me');
    return {
      id: response.id.toString(),
      username: response.username,
      name: response.name,
      email: response.email,
      role: response.role || 'user'
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
      username: response.username,
      name: response.name,
      email: response.email || '',
      role: response.role || 'user'
    };
  }

  async getAll(): Promise<User[]> {
    const response = await httpClient.get<{ users: any[] }>('/users');
    return response.users.map(dto => ({
      id: dto.id.toString(),
      name: dto.name,
      username: dto.username,
      email: dto.email,
      role: dto.role || 'user'
    }));
  }

  async create(data: Omit<CreateUserDTO, 'id'>): Promise<User> {
    const requestData = {
      name: data.name || '',
      username: data.UserCredentials.username,
      email: data.email || '',
      password: data.UserCredentials.password,
      role: data.role || 'user'
    };
    console.log('Sending user creation request:', requestData);
    const response = await httpClient.post<any>('/users', requestData);
    return {
      id: response.id.toString(),
      username: response.username,
      name: response.name,
      email: response.email,
      role: response.role || 'user'
    };
  }

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  }
}
