import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { User, UserCredentials } from '../../domain/entities/User';
import { httpClient } from '../http/HttpClient';

export class AuthRepository implements IAuthRepository {
  async login(credentials: UserCredentials): Promise<string> {
    // Unwrap the token from the response
    const response = await httpClient.post<{ token: string }>('/auth/login', credentials);
    console.log('AuthRepository login response:', response);
    return response.token;
  }

  async logout(): Promise<void> {
    await httpClient.post('/auth/logout');
  }

  async validateToken(token: string): Promise<boolean> {
    const response = await httpClient.get<{ valid: boolean }>(`/auth/validate?token=${token}`);
    return response.valid;
  }

  async register(name: string, email: string, password: string): Promise<User> {
    return await httpClient.post<User>('/users/', { name, email, password });
  }
}
