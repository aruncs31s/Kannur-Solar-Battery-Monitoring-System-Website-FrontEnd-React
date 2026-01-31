import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User, UserCredentials } from '../../domain/entities/User';
import { httpClient } from '../http/HttpClient';

export class AuthRepository implements IAuthRepository {
  async login(credentials: UserCredentials): Promise<string> {
    // skvms expects username and password
    const response = await httpClient.post<{ token: string; user: any }>('/login', {
      username: credentials.username,
      password: credentials.password
    });
    console.log('AuthRepository login response:', response);
    return response.token;
  }

  async logout(): Promise<void> {
    // No logout endpoint in skvms, just clear local storage
    localStorage.removeItem('token');
  }

  async validateToken(token: string): Promise<boolean> {
    // No validation endpoint, assume token is valid if it exists
    return !!token;
  }

  async register(name: string, email: string, password: string): Promise<User> {
    // Using the /users endpoint with authentication
    const response = await httpClient.post<any>('/users', { 
      name, 
      username: email,
      email, 
      password 
    });
    return {
      id: response.id.toString(),
      name: response.name,
      email: response.email,
      role: 'user'
    };
  }
}
