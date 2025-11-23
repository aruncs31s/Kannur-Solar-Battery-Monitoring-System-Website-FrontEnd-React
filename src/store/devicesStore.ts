import { create } from 'zustand';
import { Device } from '../domain/entities/Device';

interface DevicesStore {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  setDevices: (devices: Device[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDevicesStore = create<DevicesStore>((set) => ({
  devices: [],
  isLoading: false,
  error: null,
  setDevices: (devices) => set({ devices }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
