import { CreateDeviceDTO, CreateSolarDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO, UpdateDeviceDTO, DeviceTypeDTO, MicrocontrollerDTO, CreateSensorDeviceDTO, SolarDeviceView, DeviceStateHistoryResponse, DeviceStateHistoryFilters, CreateDeviceTypeDTO, DeviceState, CreateDeviceStateDTO, UpdateDeviceStateDTO } from '../entities/Device';
import { DeviceTokenResponse, MicrocontrollerStats } from '../../api/devices';
import { Reading } from '../entities/Reading';

export interface IDeviceRepository {
  getAll(): Promise<DeviceResponseDTO[]>;
  getAllSolarDevices(): Promise<DeviceResponseDTO[]>;
  getMyDevices(): Promise<DeviceResponseDTO[]>;
  create(device: CreateDeviceDTO): Promise<DeviceResponseDTO>;
  createSolarDevice(device: CreateSolarDeviceDTO): Promise<DeviceResponseDTO>;
  search(query: string): Promise<DeviceResponseDTO[]>;
  searchMicrocontrollers(query: string): Promise<DeviceSearchResultDTO[]>;
  getMicrocontrollers(): Promise<MicrocontrollerDTO[]>;
  getMicrocontrollerStats(): Promise<MicrocontrollerStats>;
  generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse>;
  getDeviceType(deviceId: number): Promise<DeviceTypeDTO>;
  updateDevice(deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO>;
  controlDevice(deviceId: number, action: number): Promise<{ success: boolean; message: string }>;
  removeConnectedDevice(deviceId: number, connectedDeviceId: number): Promise<{ success: boolean; message: string }>;
  getRecentDevices(): Promise<DeviceResponseDTO[]>;
  getOfflineDevices(): Promise<DeviceResponseDTO[]>;
  getProgressiveReadings(deviceId: number): Promise<Reading[]>;
  createDeviceType(data: CreateDeviceTypeDTO): Promise<{ message: string }>;
  createSensorDevice(data: CreateSensorDeviceDTO): Promise<DeviceResponseDTO>;
  getMySolarDevices(): Promise<SolarDeviceView[]>;
  getDevice(deviceId: string | number): Promise<{ device: any }>;
  uploadFirmware(deviceId: number, firmwareFile: File): Promise<{ message: string }>;
  buildFirmware(config: any): Promise<any>;
  getFirmwareBuildStatus(buildId: string): Promise<any>;
  downloadFirmware(buildId: string): Promise<Blob>;
  getDeviceStateHistory(deviceId: string | number, filters?: DeviceStateHistoryFilters): Promise<DeviceStateHistoryResponse>;
  getDeviceStates(): Promise<DeviceState[]>;
  getDeviceState(id: number): Promise<DeviceState>;
  createDeviceState(data: CreateDeviceStateDTO): Promise<DeviceState>;
  updateDeviceState(id: number, data: UpdateDeviceStateDTO): Promise<DeviceState>;
}
