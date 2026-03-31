import { create } from 'zustand';
import { User } from '../domain/entities/User';
import { decodeJWT } from '../utils/jwt';

interface AuthStore {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setToken: (token: string, refreshToken: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', refreshToken);
    const payload = decodeJWT(token);
    const userRole = payload?.role || 'user';
    set({
      token,
      refreshToken,
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
    localStorage.removeItem('refresh_token');
    set({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },

  initAuth: () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (token && refreshToken) {
      const payload = decodeJWT(token);
      const userRole = payload?.role || 'user';
      set({
        token,
        refreshToken,
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
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
    }
  },
}));
