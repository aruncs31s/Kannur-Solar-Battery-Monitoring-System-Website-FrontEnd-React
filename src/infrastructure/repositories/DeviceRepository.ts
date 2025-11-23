import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository';
import { Device, CreateDeviceDTO } from '../../domain/entities/Device';
import { httpClient } from '../http/HttpClient';

export class DeviceRepository implements IDeviceRepository {
  async getAll(): Promise<Device[]> {
    const dtos = await httpClient.get<any[]>('/esp/devices');
    return dtos.map(dto => ({
      id: dto.id,
      name: dto.device_name || dto.name,
      mac: dto.mac_id || dto.mac,
      installedLocation: dto.location || dto.installed_location || '',
      status: dto.status,
      installedBy: dto.user_id || dto.installed_by || 'Unknown',
      createdAt: dto.created_at || 0,
      updatedAt: dto.updated_at || 0,
      latitude: dto.latitude,
      longitude: dto.longitude,
    }));
  }

  async create(device: CreateDeviceDTO): Promise<Device> {
    const dto = await httpClient.post<any>('/esp/devices', {
      device_name: device.name,
      mac_id: device.mac,
      location: device.installedLocation,
      status: device.status,
      user_id: device.installedBy,
      latitude: device.latitude,
      longitude: device.longitude,
    });
    return {
      id: dto.id,
      name: dto.device_name || dto.name,
      mac: dto.mac_id || dto.mac,
      installedLocation: dto.location || dto.installed_location || '',
      status: dto.status,
      installedBy: dto.user_id || dto.installed_by || 'Unknown',
      createdAt: dto.created_at || 0,
      updatedAt: dto.updated_at || 0,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };
  }
}
