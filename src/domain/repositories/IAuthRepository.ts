import { User, UserCredentials } from '../entities/User';

export type AuthToken = {
  token: string;
}

export interface IAuthRepository {
  login(credentials: UserCredentials): Promise<string>;
  logout(): Promise<void>;
  validateToken(token: string): Promise<boolean>;
  register(
    name: string, 
    username: string,
    password: string, 
    email?: string,
    ): Promise<{ token: string; user: User }>;
}
