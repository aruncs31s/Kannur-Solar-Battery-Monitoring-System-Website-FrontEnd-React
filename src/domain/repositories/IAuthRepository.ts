import { User, UserCredentials } from '../entities/User';

export type AuthToken = {
  token: string;
  refresh_token: string;
}

export interface IAuthRepository {
  login(credentials: UserCredentials): Promise<AuthToken>;
  logout(): Promise<void>;
  validateToken(token: string): Promise<boolean>;
  register(
    name: string, 
    username: string,
    password: string, 
    email?: string,
    ): Promise<{ token: string; refresh_token: string; user: User }>;
}
