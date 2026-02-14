import { container } from '../application/di/container';
import { CreateDeviceDTO, CreateSolarDeviceDTO, CreateSensorDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO, SolarDeviceView, MicrocontrollerDTO, DeviceStateHistoryResponse, DeviceStateHistoryFilters, CreateDeviceTypeDTO, UpdateDeviceDTO, DeviceState, CreateDeviceStateDTO, UpdateDeviceStateDTO } from '../domain/entities/Device';
import { DeviceTypeDTO } from '../domain/entities/Device';

export interface DeviceTokenResponse {
  token: string;
  user_id: number;
  device_id: number;
}

export interface FirmwareBuildConfig {
  device_id: number;
  device_name: string;
  ip: string;
  host_ip: string;
  host_ssid: string;
  host_pass: string;
  port: number;
  token?: string;
  build_tool?: 'platformio' | 'arduino';
}

export interface FirmwareBuildResponse {
  build_id: string;
  message: string;
  status: 'queued' | 'building' | 'completed' | 'failed';
}

export interface FirmwareBuildStatus {
  build_id: string;
  status: 'queued' | 'building' | 'completed' | 'failed';
  progress: number;
  message: string;
  download_url?: string;
}

export interface MicrocontrollerStats {
  total_microcontrollers: number;
  online_microcontrollers: number;
  offline_microcontrollers: number;
  latest_version: string;
}

export const devicesAPI = {
  getAllDevices: async (): Promise<DeviceResponseDTO[]> => {
    return await container.getGetAllDevicesUseCase().execute();
  },

  getMyDevices: async (): Promise<DeviceResponseDTO[]> => {
    return await container.getGetMyDevicesUseCase().execute();
  },

  getMySolarDevices: async (): Promise<SolarDeviceView[]> => {
    return await container.getGetMySolarDevicesUseCase().execute();
  },

  getDeviceTypes: async (): Promise<DeviceTypeDTO[]> => {
    return await container.getGetDeviceTypesUseCase().execute();
  },

  getDeviceType: async (deviceId: number): Promise<DeviceTypeDTO> => {
    return await container.getGetDeviceTypeUseCase().execute(deviceId);
  },

  createDeviceType: async (data: CreateDeviceTypeDTO): Promise<{ message: string }> => {
    return await container.getCreateDeviceTypeUseCase().execute(data);
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
    return await container.getCreateSensorDeviceUseCase().execute(data);
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

  getMicrocontrollers: async (): Promise<MicrocontrollerDTO[]> => {
    return await container.getGetMicrocontrollersUseCase().execute();
  },

  getMicrocontrollerStats: async (): Promise<MicrocontrollerStats> => {
    return await container.getGetMicrocontrollerStatsUseCase().execute();
  },

  getDevice: async (deviceId: string | number): Promise<{ device: any }> => {
    return await container.getGetDeviceUseCase().execute(deviceId);
  },

  updateDevice: async (deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO> => {
    return await container.getUpdateDeviceUseCase().execute(deviceId, data);
  },

  controlDevice: async (deviceId: number, action: number): Promise<{ success: boolean; message: string }> => {
    return await container.getControlDeviceUseCase().execute(deviceId, action);
  },

  uploadFirmware: async (deviceId: number, firmwareFile: File): Promise<{ message: string }> => {
    return await container.getUploadFirmwareUseCase().execute(deviceId, firmwareFile);
  },

  getDeviceStateHistory: async (deviceId: string | number, filters?: DeviceStateHistoryFilters): Promise<DeviceStateHistoryResponse> => {
    return await container.getGetDeviceStateHistoryUseCase().execute(deviceId, filters);
  },

  getDeviceStates: async (): Promise<DeviceState[]> => {
    return await container.getGetDeviceStatesUseCase().execute();
  },

  getDeviceState: async (id: number): Promise<DeviceState> => {
    return await container.getGetDeviceStateUseCase().execute(id);
  },

  createDeviceState: async (data: CreateDeviceStateDTO): Promise<DeviceState> => {
    return await container.getCreateDeviceStateUseCase().execute(data);
  },

  updateDeviceState: async (id: number, data: UpdateDeviceStateDTO): Promise<DeviceState> => {
    return await container.getUpdateDeviceStateUseCase().execute(id, data);
  },

  // Firmware Builder APIs
  buildFirmware: async (config: FirmwareBuildConfig): Promise<FirmwareBuildResponse> => {
    return await container.getBuildFirmwareUseCase().execute(config);
  },

  getFirmwareBuildStatus: async (buildId: string): Promise<FirmwareBuildStatus> => {
    return await container.getGetFirmwareBuildStatusUseCase().execute(buildId);
  },

  downloadFirmware: async (buildId: string): Promise<Blob> => {
    return await container.getDownloadFirmwareUseCase().execute(buildId);
  },
};
