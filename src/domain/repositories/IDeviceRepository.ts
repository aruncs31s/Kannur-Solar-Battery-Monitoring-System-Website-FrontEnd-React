import { Device, CreateDeviceDTO } from '../entities/Device';

export interface IDeviceRepository {
  getAll(): Promise<Device[]>;
  create(device: CreateDeviceDTO): Promise<Device>;
  search(query: string): Promise<Device[]>;
}
