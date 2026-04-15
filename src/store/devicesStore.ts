import { create } from 'zustand';
import { DeviceResponseDTO } from '../application/types/devices/device';

interface DevicesStore {
  devices: DeviceResponseDTO[];
  isLoading: boolean;
  error: string | null;
  setDevices: (devices: DeviceResponseDTO[]) => void;
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
