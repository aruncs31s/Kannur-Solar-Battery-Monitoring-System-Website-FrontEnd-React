import { container } from '../application/di/container';
import { CreateDeviceDTO, CreateSolarDeviceDTO, CreateSensorDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO, SolarDeviceWithType, MicrocontrollerDTO, DeviceStateHistoryResponse, DeviceStateHistoryFilters, CreateDeviceTypeDTO, UpdateDeviceDTO, DeviceState, CreateDeviceStateDTO, UpdateDeviceStateDTO, ConnectedDeviceDTO, CreateConnectedDeviceDTO, MainStatsDTO, DeviceOwnership, TransferOwnershipDTO } from '../domain/entities/Device';
import { DeviceTypeDTO } from '../domain/entities/Device';
import { DeviceTokenResponse, FirmwareBuildConfig, FirmwareBuildResponse, FirmwareBuildStatus } from '../application/types/devices/device';
import { MicrocontrollerStats } from '../application/types/devices/stats';

export type { DeviceTokenResponse, FirmwareBuildConfig, FirmwareBuildResponse, FirmwareBuildStatus, MicrocontrollerStats };




export const devicesAPI = {
  getAllDevices: async (): Promise<DeviceResponseDTO[]> => {
    return await container.getGetAllDevicesUseCase().execute();
  },

  getMyDevices: async (): Promise<DeviceResponseDTO[]> => {
    return await container.getGetMyDevicesUseCase().execute();
  },

  getMySolarDevices: async (): Promise<SolarDeviceWithType[]> => {
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

  getMyMicrocontrollers: async (): Promise<MicrocontrollerDTO[]> => {
    return await container.getGetMyMicrocontrollersUseCase().execute();
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

  deleteDevice: async (deviceId: number): Promise<void> => {
    return await container.getDeleteDeviceUseCase().execute(deviceId);
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

  getConnectedDevices: async (deviceId: number): Promise<ConnectedDeviceDTO[]> => {
    return await container.getGetConnectedDevicesUseCase().execute(deviceId);
  },

  addConnectedDevice: async (deviceId: number, childId: number): Promise<{ message: string }> => {
    return await container.getAddConnectedDeviceUseCase().execute(deviceId, childId);
  },

  createAndConnectDevice: async (deviceId: number, data: CreateConnectedDeviceDTO): Promise<{ message: string }> => {
    return await container.getCreateAndConnectDeviceUseCase().execute(deviceId, data);
  },

  getMainStats: async (): Promise<MainStatsDTO> => {
    return await container.getGetMainStatsUseCase().execute();
  },
  getOwnership: async (deviceId: number): Promise<DeviceOwnership> => {
    return await container.getGetDeviceOwnershipUseCase().execute(deviceId);
  },
  transferOwnership: async (deviceId: number, data: TransferOwnershipDTO): Promise<void> => {
    return await container.getTransferDeviceOwnershipUseCase().execute(deviceId, data);
  },
  setVisibility: async (deviceId: number, isPublic: boolean): Promise<void> => {
    return await container.getSetDeviceVisibilityUseCase().execute(deviceId, isPublic);
  },
};

