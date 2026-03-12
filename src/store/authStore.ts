import { create } from 'zustand';
import { User } from '../domain/entities/User';
import { decodeJWT } from '../utils/jwt';

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setToken: (token: string) => {
    localStorage.setItem('token', token);
    const payload = decodeJWT(token);
    const userRole = payload?.role || 'user';
    set({
      token,
      isAuthenticated: true,
      isLoading: false,
      user: payload ? new User(
        payload.id || '',
        payload.username || '',
        payload.name,
        payload.email,
        userRole
      ) : null
    });
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      token: null,
      user: null,
      isAuthenticated: false,
    });
  },

  initAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = decodeJWT(token);
      const userRole = payload?.role || 'user';
      set({
        token,
        isAuthenticated: true,
        isLoading: false,
        user: payload ? new User(
          payload.id || '',
          payload.username || '',
          payload.name,
          payload.email,
          userRole
        ) : null
      });
    } else {
      set({
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
    }
  },
}));
