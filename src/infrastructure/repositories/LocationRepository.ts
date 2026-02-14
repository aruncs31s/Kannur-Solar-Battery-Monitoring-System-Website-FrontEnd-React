import { ILocationRepository } from '../../domain/repositories/ILocationRepository';
import { CreateLocationDTO, LocationResponseDTO, UpdateLocationDTO, LocationDeviceDTO } from '../../domain/entities/Location';
import { httpClient } from '../http/HttpClient';

export class LocationRepository implements ILocationRepository {
  async getAll(): Promise<LocationResponseDTO[]> {
    const response = await httpClient.get<{ locations: any[] }>('/locations');
    return response.locations.map(dto => ({
      id: dto.id,
      name: dto.name || '',
      description: dto.description || '',
      code: dto.code || '',
      city: dto.city,
      state: dto.state,
      pin_code: dto.pin_code,
      device_count: dto.device_count || 0,
      user_count: dto.user_count || 0,
      status: dto.status || 'active',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }));
  }

  async getById(id: number): Promise<LocationResponseDTO> {
    const response = await httpClient.get<{ location: any }>(`/locations/${id}`);
    const dto = response.location;
    return {
      id: dto.id,
      name: dto.name || '',
      description: dto.description || '',
      code: dto.code || '',
      city: dto.city,
      state: dto.state,
      pin_code: dto.pin_code,
      device_count: dto.device_count || 0,
      user_count: dto.user_count || 0,
      status: dto.status || 'active',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  async search(query: string): Promise<LocationResponseDTO[]> {
    const response = await httpClient.get<{ locations: any[] }>(`/locations/search?q=${encodeURIComponent(query)}`);
    return response.locations.map(dto => ({
      id: dto.id,
      name: dto.name || '',
      description: dto.description || '',
      code: dto.code || '',
      city: dto.city,
      state: dto.state,
      pin_code: dto.pin_code,
      device_count: dto.device_count || 0,
      user_count: dto.user_count || 0,
      status: dto.status || 'active',
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    }));
  }

  async create(location: CreateLocationDTO): Promise<{ message: string }> {
    const response = await httpClient.post<{ message: string }>('/locations', location);
    return response;
  }

  async update(id: number, location: UpdateLocationDTO): Promise<{ message: string }> {
    const response = await httpClient.put<{ message: string }>(`/locations/${id}`, location);
    return response;
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await httpClient.delete<{ message: string }>(`/locations/${id}`);
    return response;
  }

  async getDevicesByLocation(locationId: number): Promise<LocationDeviceDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>(`/locations/${locationId}/devices`);
    return response.devices.map(dto => ({
      id: dto.id,
      name: dto.name || '',
      type: dto.type || '',
      hardware_type: dto.hardware_type || 0,
      status: dto.status || 'unknown',
      ip_address: dto.ip_address || '',
      mac_address: dto.mac_address || '',
      firmware_version: dto.firmware_version || '',
    }));
  }
}