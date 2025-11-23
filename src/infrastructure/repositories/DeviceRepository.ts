import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository';
import { Device, CreateDeviceDTO } from '../../domain/entities/Device';
import { httpClient } from '../http/HttpClient';

export class DeviceRepository implements IDeviceRepository {
  async getAll(): Promise<Device[]> {
    const dtos = await httpClient.get<any[]>('/esp/devices');
    return dtos.map(dto => ({
      id: dto.id,
      name: dto.name,
      mac: dto.mac,
      installedLocation: dto.installed_location,
      status: dto.status,
      installedBy: dto.installed_by,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      latitude: dto.latitude,
      longitude: dto.longitude,
    }));
  }

  async create(device: CreateDeviceDTO): Promise<Device> {
    const dto = await httpClient.post<any>('/esp/devices', {
      name: device.name,
      mac: device.mac,
      installed_location: device.installedLocation,
      status: device.status,
      installed_by: device.installedBy,
      latitude: device.latitude,
      longitude: device.longitude,
    });
    return {
      id: dto.id,
      name: dto.name,
      mac: dto.mac,
      installedLocation: dto.installed_location,
      status: dto.status,
      installedBy: dto.installed_by,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      latitude: dto.latitude,
      longitude: dto.longitude,
    };
  }
}
