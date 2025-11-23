import { container } from '../application/di/container';
import { User } from '../domain/entities/User';

export const usersAPI = {
  getById: async (id: number): Promise<User> => {
    return await container.getUserRepository().getById(id);
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    return await container.getUserRepository().update(id, data);
  },

  getCurrentUser: async (): Promise<User> => {
    return await container.getUserRepository().getCurrent();
  },
};
