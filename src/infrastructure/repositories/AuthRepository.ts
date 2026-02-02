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

  async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
    // Using the /register endpoint
    const response = await httpClient.post<{ token: string; user: any }>('/register', { 
      name, 
      username: email,
      email, 
      password 
    });
    return {
      token: response.token,
      user: {
        id: response.user.id.toString(),
        username: response.user.username,
        name: response.user.name,
        email: response.user.email,
        role: 'user'
      }
    };
  }
}
