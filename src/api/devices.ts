import { container } from '../application/di/container';
import { Device, CreateDeviceDTO } from '../domain/entities/Device';

export const devicesAPI = {
  getAllDevices: async (): Promise<Device[]> => {
    return await container.getGetAllDevicesUseCase().execute();
  },

  createDevice: async (data: CreateDeviceDTO): Promise<Device> => {
    return await container.getCreateDeviceUseCase().execute(data);
  },

  searchDevices: async (query: string): Promise<Device[]> => {
    return await container.getSearchDevicesUseCase().execute(query);
  },
};
