import { container } from '../application/di/container';
import { User, UserCredentials } from '../domain/entities/User';

export const authAPI = {
  login: async (credentials: UserCredentials): Promise<string> => {
    const token = await container.getLoginUseCase().execute(credentials);
    console.log(token );
    return token;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    return await container.getAuthRepository().register(name, email, password);
  },

  logout: async (): Promise<void> => {
    await container.getLogoutUseCase().execute();
  },

  validateToken: async (token: string): Promise<boolean> => {
    return await container.getAuthRepository().validateToken(token);
  },
};
