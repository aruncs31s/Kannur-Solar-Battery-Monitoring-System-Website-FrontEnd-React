import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository';
import {  CreateDeviceDTO, DeviceResponseDTO } from '../../domain/entities/Device';
import { httpClient } from '../http/HttpClient';

export class DeviceRepository implements IDeviceRepository {
  async getAll(): Promise<DeviceResponseDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices');
    return response.devices.map(dto => ({
      id: dto.id,
      name: dto.name || '',
      type: dto.type || '',
      ip_address: dto.ip_address || '',
      mac_address: dto.mac_address || '',
      firmware_version: dto.firmware_version || '',
      version_id: dto.version_id || 0,
      address: dto.address || '',
      city: dto.city || '',
      device_state: dto.device_state || 0,
    }));
  }

  async create(device: CreateDeviceDTO): Promise< DeviceResponseDTO> {
    const dto = await httpClient.post<any>('/devices', {
      name: device.name,
      type: device.type,
      mac_address: device.mac_address,
      ip_address: device.ip_address,
      firmware_version_id: device.firmware_version_id,
      address: device.address,
      city: device.city,
    });
    return {
      id: dto.id,
      name: dto.name || '',
      type: dto.type || '',
      ip_address: dto.ip_address || '',
      mac_address: dto.mac_address || '',
      firmware_version: dto.firmware_version || '',
      version_id: dto.version_id || 0,
      address: dto.address || '',
      city: dto.city || '',
      device_state: dto.device_state || 0,
    };
  }

  async search(query: string): Promise<DeviceResponseDTO[]> {
    // skvms doesn't have a search endpoint, so we'll filter client-side
    const allDevices = await this.getAll();
    return allDevices.filter(device => 
      device.name.toLowerCase().includes(query.toLowerCase()) ||
      device.mac_address.toLowerCase().includes(query.toLowerCase())
    );
  }
}
