import { Device, CreateDeviceDTO, DeviceResponseDTO } from '../entities/Device';
import { DeviceTokenResponse } from '../../api/devices';

export interface IDeviceRepository {
  getAll(): Promise<DeviceResponseDTO[]>;
  getMyDevices(): Promise<DeviceResponseDTO[]>;
  create(device: CreateDeviceDTO): Promise<DeviceResponseDTO>;
  search(query: string): Promise<DeviceResponseDTO[]>;
  generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse>;
}
