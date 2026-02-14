import { IDeviceTypesRepository, DeviceTypeDTO } from '../../domain/entities/Device';
import { httpClient } from '../http/HttpClient';

export class DeviceTypesRepository implements IDeviceTypesRepository {
  async getAll(): Promise<DeviceTypeDTO[]> {
    const response = await httpClient.get<{ device_types: any[] }>('/devices/types');
    return response.device_types.map(dto => ({
      id: dto.id,
      name: dto.name || '',
      features: dto.features,
    }));
  }

  async getHardwareTypes(): Promise<DeviceTypeDTO[]> {
    const response = await httpClient.get<{ device_type: any[] }>('/devices/types/hardware');
    return response.device_type.map(dto => ({
      id: dto.id,
      name: dto.name || '',
    }));
  }
}