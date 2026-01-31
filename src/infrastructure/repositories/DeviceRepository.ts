import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository';
import { Device, CreateDeviceDTO, DeviceStatus } from '../../domain/entities/Device';
import { httpClient } from '../http/HttpClient';

export class DeviceRepository implements IDeviceRepository {
  async getAll(): Promise<Device[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices');
    return response.devices.map(dto => ({
      id: dto.id.toString(),
      name: dto.name || '',
      mac: dto.mac_address || '',
      installedLocation: dto.address || '',
      status: this.mapDeviceState(dto.device_state),
      installedBy: dto.created_by?.toString() || 'Unknown',
      createdAt: new Date(dto.created_at).getTime() || 0,
      updatedAt: new Date(dto.updated_at).getTime() || 0,
      latitude: 0, // Not in skvms model
      longitude: 0, // Not in skvms model
    }));
  }

  async create(device: CreateDeviceDTO): Promise<Device> {
    const dto = await httpClient.post<any>('/devices', {
      name: device.name,
      type: 1, // Default type, you can make this configurable
      mac_address: device.mac,
      address: device.installedLocation,
      ip_address: '',
      city: '',
    });
    return {
      id: dto.id.toString(),
      name: dto.name || '',
      mac: dto.mac_address || '',
      installedLocation: dto.address || '',
      status: this.mapDeviceState(dto.device_state),
      installedBy: dto.created_by?.toString() || 'Unknown',
      createdAt: new Date(dto.created_at).getTime() || 0,
      updatedAt: new Date(dto.updated_at).getTime() || 0,
      latitude: 0,
      longitude: 0,
    };
  }

  async search(query: string): Promise<Device[]> {
    // skvms doesn't have a search endpoint, so we'll filter client-side
    const allDevices = await this.getAll();
    return allDevices.filter(device => 
      device.name.toLowerCase().includes(query.toLowerCase()) ||
      device.mac.toLowerCase().includes(query.toLowerCase())
    );
  }

  private mapDeviceState(state: number): DeviceStatus {
    // 1 = Active, 2 = Inactive, 3 = Maintenance, 4 = Decommissioned
    const stateMap: { [key: number]: DeviceStatus } = {
      1: 'active',
      2: 'inactive',
      3: 'maintenance',
      4: 'decommissioned'
    };
    return stateMap[state] || 'unknown';
  }
}
