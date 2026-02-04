import { IDeviceTypesRepository, DeviceTypeDTO } from '../../domain/repositories/IDeviceTypesRepository';
import { httpClient } from '../http/HttpClient';

export class DeviceTypesRepository implements IDeviceTypesRepository {
  async getAll(): Promise<DeviceTypeDTO[]> {
    const response = await httpClient.get<{ device_types: any[] }>('/devices/types');
    return response.device_types.map(dto => ({
      id: dto.id,
      name: dto.name || '',
    }));
  }
}