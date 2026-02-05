import { container } from '../application/di/container';
import { CreateDeviceDTO, CreateSolarDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO } from '../domain/entities/Device';
import { DeviceTypeDTO } from '../domain/entities/Device';

export interface CreateDeviceTypeDTO {
  name: string;
  hardware_type: number;
}

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

  createDeviceType: async (data: CreateDeviceTypeDTO): Promise<{ message: string }> => {
    const response = await fetch('/api/devices/types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create device type');
    }

    return await response.json();
  },

  getHardwareDeviceTypes: async (): Promise<{ device_type: DeviceTypeDTO[] }> => {
    return await container.getGetHardwareDeviceTypesUseCase().execute().then(types => ({ device_type: types }));
  },

  createDevice: async (data: CreateDeviceDTO): Promise<DeviceResponseDTO> => {
    return await container.getCreateDeviceUseCase().execute(data);
  },

  createSolarDevice: async (data: CreateSolarDeviceDTO): Promise<DeviceResponseDTO> => {
    return await container.getCreateSolarDeviceUseCase().execute(data);
  },

  searchDevices: async (query: string): Promise<DeviceResponseDTO[]> => {
    return await container.getSearchDevicesUseCase().execute(query);
  },

  searchMicrocontrollers: async (query: string): Promise<DeviceSearchResultDTO[]> => {
    return await container.getSearchMicrocontrollersUseCase().execute(query);
  },

  generateDeviceToken: async (deviceId: number): Promise<DeviceTokenResponse> => {
    return await container.getGenerateDeviceTokenUseCase().execute(deviceId);
  },
};
