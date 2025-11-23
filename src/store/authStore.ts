import { create } from 'zustand';
import { User } from '../domain/entities/User';

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
    set({ token, isAuthenticated: true, isLoading: false });
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
    set({
      token,
      isAuthenticated: !!token,
      isLoading: false,
    });
  },
}));
