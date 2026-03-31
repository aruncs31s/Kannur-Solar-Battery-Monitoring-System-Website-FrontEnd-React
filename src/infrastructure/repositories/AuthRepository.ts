import { IAuthRepository, AuthToken } from '../../domain/repositories/IAuthRepository';
import { User, UserCredentials } from '../../domain/entities/User';
import { httpClient } from '../http/HttpClient';
import { UserResponse } from '../../application/types/user';

export class AuthRepository implements IAuthRepository {
  async login(credentials: UserCredentials): Promise<AuthToken> {
    // skvms expects username and password
    const response = await httpClient.post<{ token: string; refresh_token: string; user: any }>('/login', {
      username: credentials.username,
      password: credentials.password
    });
    console.log('AuthRepository login response:', response);
    return { token: response.token, refresh_token: response.refresh_token };
  }
  // TODO: Implement
  async logout(): Promise<void> {
    // No logout endpoint in skvms, just clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
  }

  async validateToken(token: string): Promise<boolean> {
    // No validation endpoint, assume token is valid if it exists
    return !!token;
  }

  async register(
    username: string,
    password: string,
    name?: string,
    email?: string
  ): Promise<{ token: string; refresh_token: string; user: User }> {
    // Using the /register endpoint
    const response = await httpClient.post<{ token: string; refresh_token: string; user: UserResponse }>('/register', {
      name,
      username,
      email,
      password
    });
    return {
      token: response.token,
      refresh_token: response.refresh_token,
      user: new User(
        response.user.id.toString(),
        response.user.username,
        response.user.name,
        response.user.email,
        response.user.role || 'user'
      )
    };
  }
}
