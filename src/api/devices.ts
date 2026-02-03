import { container } from '../application/di/container';
import { CreateDeviceDTO, DeviceResponseDTO } from '../domain/entities/Device';
import { DeviceTypeDTO } from '../domain/repositories/IDeviceTypesRepository';

export interface DeviceTokenResponse {
  token: string;
  user_id: number;
  device_id: number;
}

export const devicesAPI = {
  getAllDevices: async (): Promise<DeviceResponseDTO[]> => {
    return await container.getGetAllDevicesUseCase().execute();
  },

  getMyDevices: async (): Promise<DeviceResponseDTO[]> => {
    return await container.getGetMyDevicesUseCase().execute();
  },

  getDeviceTypes: async (): Promise<DeviceTypeDTO[]> => {
    return await container.getGetDeviceTypesUseCase().execute();
  },

  createDevice: async (data: CreateDeviceDTO): Promise<DeviceResponseDTO> => {
    return await container.getCreateDeviceUseCase().execute(data);
  },

  searchDevices: async (query: string): Promise<DeviceResponseDTO[]> => {
    return await container.getSearchDevicesUseCase().execute(query);
  },

  generateDeviceToken: async (deviceId: number): Promise<DeviceTokenResponse> => {
    return await container.getGenerateDeviceTokenUseCase().execute(deviceId);
  },
};
