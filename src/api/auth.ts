import { container } from "../application/di/container";
import { User, UserCredentials } from "../domain/entities/User";

export const authAPI = {
  login: async (credentials: UserCredentials): Promise<string> => {
    const token = await container.getLoginUseCase().execute(credentials);
    return token;
  },

  register: async (
    username: string,
    password: string,
    email?: string,
    name?: string,
  ): Promise<{ token: string; user: User }> => {
    return await container.getAuthRepository().register( username, password, name,email);
  },

  logout: async (): Promise<void> => {
    await container.getLogoutUseCase().execute();
  },

  validateToken: async (token: string): Promise<boolean> => {
    return await container.getAuthRepository().validateToken(token);
  },
};
