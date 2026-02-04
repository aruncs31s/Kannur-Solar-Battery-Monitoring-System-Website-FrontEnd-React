import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository';
import {  CreateDeviceDTO, CreateSolarDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO } from '../../domain/entities/Device';
import { DeviceTokenResponse } from '../../api/devices';
import { httpClient } from '../http/HttpClient';

export class DeviceRepository implements IDeviceRepository {
  async getAll(): Promise<DeviceResponseDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices');
    return response.devices.map(dto => ({
      id: dto.id,
      name: dto.name || '',
      type: dto.type || '',
      ip_address: dto.ipAddress || '',
      mac_address: dto.macAddress || '',
      firmware_version: dto.firmwareVersion || '',
      version_id: dto.version_id || 0,
      address: dto.address || '',
      city: dto.city || '',
      device_state: dto.deviceState || 0,
    }));
  }

  async getMyDevices(): Promise<DeviceResponseDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices/my');
    return response.devices.map(dto => ({
      id: dto.id,
      name: dto.name || '',
      type: dto.type || '',
      ip_address: dto.ipAddress || '',
      mac_address: dto.macAddress || '',
      firmware_version: dto.firmwareVersion || '',
      version_id: dto.version_id || 0,
      address: dto.address || '',
      city: dto.city || '',
      device_state: dto.deviceState || 0,
    }));
  }

  async create(device: CreateDeviceDTO): Promise< DeviceResponseDTO> {
    const dto = await httpClient.post<any>('/devices', {
      name: device.name,
      uid: device.uid,
      type: device.type,
      ip_address: device.ip_address,
      mac_address: device.mac_address,
      firmware_version_id: device.firmware_version_id,
      address: device.address,
      city: device.city,
    });
    return {
      id: dto.id,
      name: dto.name || '',
      type: dto.type || '',
      ip_address: dto.ipAddress || '',
      mac_address: dto.macAddress || '',
      firmware_version: dto.firmwareVersion || '',
      version_id: device.firmware_version_id || 0, // Since backend doesn't return it, use the input
      address: dto.address || '',
      city: dto.city || '',
      device_state: dto.deviceState || 0,
    };
  }

  async createSolarDevice(device: CreateSolarDeviceDTO): Promise<DeviceResponseDTO> {
    const dto = await httpClient.post<any>('/devices/solar', {
      name: device.name,
      device_type_id: device.device_type_id,
      address: device.address,
      city: device.city,
      connected_microcontroller_id: device.connected_microcontroller_id,
    });
    return {
      id: dto.device.id,
      name: dto.device.name || '',
      type: dto.device.type || '',
      ip_address: dto.device.ip_address || '',
      mac_address: dto.device.mac_address || '',
      firmware_version: dto.device.firmware_version || '',
      version_id: 0, // Not provided in response
      address: dto.device.address || '',
      city: dto.device.city || '',
      device_state: 0, // Not provided
    };
  }

  async search(query: string): Promise<DeviceResponseDTO[]> {
    const searchResults = await httpClient.get<DeviceSearchResultDTO[]>(`/devices/search?q=${encodeURIComponent(query)}`);
    if (!searchResults || searchResults.length === 0) return [];
    const allDevices = await this.getAll();
    return allDevices.filter(device => searchResults.some(sr => sr.id === device.id));
  }

  async searchMicrocontrollers(query: string): Promise<DeviceSearchResultDTO[]> {
    return await httpClient.get<DeviceSearchResultDTO[]>(`/devices/search/microcontrollers?q=${encodeURIComponent(query)}`);
  }

  async generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse> {
    return await httpClient.post<DeviceTokenResponse>('/device-auth/token', { device_id: deviceId });
  }
}
