import { container } from '../application/di/container';
import { CreateDeviceDTO, CreateSolarDeviceDTO, CreateSensorDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO, SolarDeviceView, UpdateDeviceDTO } from '../domain/entities/Device';
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

  createSensorDevice: async (data: CreateSensorDeviceDTO): Promise<DeviceResponseDTO> => {
    const response = await fetch('/api/devices/sensors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create sensor device');
    }

    return await response.json();
  },

  getMySolarDevices: async (): Promise<SolarDeviceView[]> => {
    const response = await fetch('/api/devices/solar/my', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch solar devices');
    }

    const data = await response.json();
    return data.devices || [];
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

  getDevice: async (deviceId: string | number): Promise<{ device: any }> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8080/api/devices/${deviceId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error('Failed to load device');
    }

    return await response.json();
  },

  getDeviceType: async (deviceId: number): Promise<DeviceTypeDTO> => {
    return await container.getGetDeviceTypeUseCase().execute(deviceId);
  },

  updateDevice: async (deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO> => {
    return await container.getUpdateDeviceUseCase().execute(deviceId, data);
  },

  controlDevice: async (deviceId: number, action: number): Promise<{ success: boolean; message: string }> => {
    return await container.getControlDeviceUseCase().execute(deviceId, action);
  },
};
