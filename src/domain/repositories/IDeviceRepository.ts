import { CreateDeviceDTO, CreateSolarDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO, UpdateDeviceDTO, DeviceTypeDTO } from '../entities/Device';
import { DeviceTokenResponse } from '../../api/devices';

export interface IDeviceRepository {
  getAll(): Promise<DeviceResponseDTO[]>;
  getMyDevices(): Promise<DeviceResponseDTO[]>;
  create(device: CreateDeviceDTO): Promise<DeviceResponseDTO>;
  createSolarDevice(device: CreateSolarDeviceDTO): Promise<DeviceResponseDTO>;
  search(query: string): Promise<DeviceResponseDTO[]>;
  searchMicrocontrollers(query: string): Promise<DeviceSearchResultDTO[]>;
  generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse>;
  getDeviceType(deviceId: number): Promise<DeviceTypeDTO>;
  updateDevice(deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO>;
  controlDevice(deviceId: number, action: number): Promise<{ success: boolean; message: string }>;
  removeConnectedDevice(deviceId: number, connectedDeviceId: number): Promise<{ success: boolean; message: string }>;
}
