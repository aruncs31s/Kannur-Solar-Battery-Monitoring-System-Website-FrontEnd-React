import { CreateDeviceDTO, CreateSolarDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO } from '../entities/Device';
import { DeviceTokenResponse } from '../../api/devices';

export interface IDeviceRepository {
  getAll(): Promise<DeviceResponseDTO[]>;
  getMyDevices(): Promise<DeviceResponseDTO[]>;
  create(device: CreateDeviceDTO): Promise<DeviceResponseDTO>;
  createSolarDevice(device: CreateSolarDeviceDTO): Promise<DeviceResponseDTO>;
  search(query: string): Promise<DeviceResponseDTO[]>;
  searchMicrocontrollers(query: string): Promise<DeviceSearchResultDTO[]>;
  generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse>;
}
