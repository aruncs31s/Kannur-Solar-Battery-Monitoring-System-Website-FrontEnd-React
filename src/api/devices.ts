import { container } from '../application/di/container';
import { CreateDeviceDTO, DeviceResponseDTO } from '../domain/entities/Device';

export const devicesAPI = {
  getAllDevices: async (): Promise<DeviceResponseDTO[]> => {
    return await container.getGetAllDevicesUseCase().execute();
  },

  createDevice: async (data: CreateDeviceDTO): Promise<DeviceResponseDTO> => {
    return await container.getCreateDeviceUseCase().execute(data);
  },

  searchDevices: async (query: string): Promise<DeviceResponseDTO[]> => {
    return await container.getSearchDevicesUseCase().execute(query);
  },
};
