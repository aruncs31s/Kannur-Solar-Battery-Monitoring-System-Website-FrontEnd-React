import { IDeviceRepository } from '../../domain/repositories/IDeviceRepository';
import { CreateDeviceDTO, CreateSolarDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO, UpdateDeviceDTO, DeviceTypeDTO, MicrocontrollerDTO, CreateSensorDeviceDTO, SolarDeviceView, DeviceStateHistoryResponse, DeviceStateHistoryFilters, CreateDeviceTypeDTO, DeviceState, CreateDeviceStateDTO, UpdateDeviceStateDTO, DeviceStatus, ConnectedDeviceDTO, CreateConnectedDeviceDTO, MainStatsDTO, DeviceOwnership, TransferOwnershipDTO } from '../../domain/entities/Device';
import { DeviceTokenResponse, MicrocontrollerStats } from '../../api/devices';
import { ProgressiveReadingsResponse, ProgressiveReadingsDTO, ReadingResponseDTO } from '../../domain/entities/Reading';
import { httpClient } from '../http/HttpClient';

export class DeviceRepository implements IDeviceRepository {
  private mapToDeviceResponseDTO(dto: any): DeviceResponseDTO {
    const stateId = dto.current_state || dto.device_state || dto.deviceState || 0;
    return {
      id: dto.id,
      name: dto.name || '',
      type: dto.type || '',
      ip_address: dto.ip_address || dto.ipAddress || '',
      mac_address: dto.mac_address || dto.macAddress || '',
      firmware_version: dto.firmware_version || dto.firmwareVersion || '',
      version_id: dto.version_id || dto.versionId || 0,
      address: dto.address || '',
      city: dto.city || '',
      status: dto.status || this.mapStateToStatus(stateId),
      device_state: stateId,
    };
  }

  private mapStateToStatus(stateId: number): DeviceStatus {
    const states: { [key: number]: DeviceStatus } = {
      1: 'active',
      2: 'inactive',
      3: 'maintenance',
      4: 'decommissioned',
      5: 'active',
    };
    return states[stateId] || 'unknown';
  }

  async getAll(): Promise<DeviceResponseDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices');
    return (response.devices || []).map(dto => this.mapToDeviceResponseDTO(dto));
  }
  async getMainStats(): Promise<MainStatsDTO> {
    const response = await httpClient.get<{ stats: MainStatsDTO }>('/devices/my/stats');
    return response.stats;
  }

  async getAllSolarDevices(): Promise<DeviceResponseDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices/solar');
    return (response.devices || []).map(dto => this.mapToDeviceResponseDTO(dto));
  }
  async getRecentDevices(): Promise<DeviceResponseDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices/recent');
    return (response.devices || []).map(dto => this.mapToDeviceResponseDTO(dto));
  }
  async getOfflineDevices(): Promise<DeviceResponseDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices/solar/offline');
    return (response.devices || []).map(dto => this.mapToDeviceResponseDTO(dto));
  }
  async getMyDevices(): Promise<DeviceResponseDTO[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices/my');
    return (response.devices || []).map(dto => this.mapToDeviceResponseDTO(dto));
  }

  async create(device: CreateDeviceDTO): Promise<DeviceResponseDTO> {
    const dto = await httpClient.post<any>('/devices', {
      name: device.name,
      type: device.type,
      ip_address: device.ip_address,
      mac_address: device.mac_address,
      firmware_version_id: device.firmware_version_id,
      address: device.address,
      city: device.city,
    });
    return this.mapToDeviceResponseDTO(dto);
  }

  async createSolarDevice(device: CreateSolarDeviceDTO): Promise<DeviceResponseDTO> {
    const dto = await httpClient.post<any>('/devices/solar', {
      name: device.name,
      device_type_id: device.device_type_id,
      address: device.address,
      city: device.city,
      connected_microcontroller_id: device.connected_microcontroller_id,
    });
    return this.mapToDeviceResponseDTO(dto.device);
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

  async getMicrocontrollers(): Promise<MicrocontrollerDTO[]> {
    const response = await httpClient.get<{ devices: MicrocontrollerDTO[] }>('/devices/microcontrollers');
    return response.devices;
  }

  async getMicrocontrollerStats(): Promise<MicrocontrollerStats> {
    const response = await httpClient.get<{ stats: MicrocontrollerStats }>('/devices/microcontrollers/stats');
    return response.stats;
  }

  async generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse> {
    return await httpClient.post<DeviceTokenResponse>('/device-auth/token', { device_id: deviceId });
  }

  async getDeviceType(deviceId: number): Promise<DeviceTypeDTO> {
    const response = await httpClient.get<{ device_type: DeviceTypeDTO }>(`/devices/${deviceId}/type`);
    if (!response.device_type) {
      throw new Error(`Device type not found for device ${deviceId}`);
    }
    return {
      id: response.device_type.id,
      name: response.device_type.name,
      features: response.device_type.features,
    };
  }

  async updateDevice(deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO> {
    const dto = await httpClient.put<any>(`/devices/${deviceId}`, {
      name: data.name,
      type: data.type,
      ip_address: data.ip_address,
      mac_address: data.mac_address,
      firmware_version_id: data.firmware_version_id,
      address: data.address,
      city: data.city,
    });
    return this.mapToDeviceResponseDTO(dto);
  }

  async deleteDevice(deviceId: number): Promise<void> {
    await httpClient.delete(`/devices/${deviceId}`);
  }

  async controlDevice(deviceId: number, action: number): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.post<{ success: boolean; message: string }>(
      `/devices/${deviceId}/control`,
      { action }
    );
    return response;
  }

  async removeConnectedDevice(deviceId: number, connectedDeviceId: number): Promise<{ success: boolean; message: string }> {
    const response = await httpClient.delete<{ success: boolean; message: string }>(
      `/devices/${deviceId}/connected/${connectedDeviceId}`
    );
    return response;
  }

  async getConnectedDevices(deviceId: number): Promise<ConnectedDeviceDTO[]> {
    const response = await httpClient.get<{ connected_devices: ConnectedDeviceDTO[] }>(
      `/devices/${deviceId}/connected`
    );
    return response.connected_devices || [];
  }

  async addConnectedDevice(deviceId: number, childId: number): Promise<{ message: string }> {
    return await httpClient.post(`/devices/${deviceId}/connected`, { child_id: childId });
  }

  async createAndConnectDevice(deviceId: number, data: CreateConnectedDeviceDTO): Promise<{ message: string }> {
    return await httpClient.post(`/devices/${deviceId}/connected/new`, data);
  }

  async getOwnership(deviceId: number): Promise<DeviceOwnership> {
    const response = await httpClient.get<{ ownership: DeviceOwnership }>(`/devices/${deviceId}/ownership`);
    return response.ownership;
  }

  async transferOwnership(deviceId: number, data: TransferOwnershipDTO): Promise<void> {
    await httpClient.post(`/devices/${deviceId}/transfer`, data);
  }

  async setVisibility(deviceId: number, isPublic: boolean): Promise<void> {
    await httpClient.put(`/devices/${deviceId}/public`, { is_public: isPublic });
  }

  async getProgressiveReadings(deviceId: number): Promise<ProgressiveReadingsResponse> {
    const response = await httpClient.get<ProgressiveReadingsDTO>(`/devices/${deviceId}/readings/progressive`);
    return {
      readings: response.readings.map((reading: ReadingResponseDTO) => ({
        id: `${deviceId}-${reading.created_at}`,
        deviceId: deviceId.toString(),
        voltage: reading.voltage,
        current: reading.current,
        avg_voltage: reading.avg_voltage,
        avg_current: reading.avg_current,
        power: reading.power,
        timestamp: new Date(reading.created_at).getTime(),
      })),
      averages: response.averages,
      last_reading_time: response.last_reading_time
    };
  }

  async createDeviceType(data: CreateDeviceTypeDTO): Promise<{ message: string }> {
    return await httpClient.post('/devices/types', data);
  }

  async createSensorDevice(data: CreateSensorDeviceDTO): Promise<DeviceResponseDTO> {
    const response = await httpClient.post<any>('/devices/sensors', data);
    return this.mapToDeviceResponseDTO(response);
  }

  async getMySolarDevices(): Promise<SolarDeviceView[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices/solar/my');
    return response.devices || [];
  }

  async getDevice(deviceId: string | number): Promise<{ device: DeviceResponseDTO }> {
    const response = await httpClient.get<{ device: any }>(`/devices/${deviceId}`);
    return {
      device: this.mapToDeviceResponseDTO(response.device)
    };
  }

  async uploadFirmware(deviceId: number, firmwareFile: File): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append('firmware', firmwareFile);
    return await httpClient.post(`/codegen/upload?device_id=${deviceId}`, formData);
  }

  async buildFirmware(config: any): Promise<any> {
    return await httpClient.post('/codegen/build', config);
  }

  async getFirmwareBuildStatus(buildId: string): Promise<any> {
    return await httpClient.get(`/codegen/build/${buildId}/status`);
  }

  async downloadFirmware(buildId: string): Promise<Blob> {
    const response = await httpClient.get(`/codegen/build/${buildId}/download`, {
      responseType: 'blob'
    });
    return response as Blob;
  }

  async getDeviceStateHistory(deviceId: string | number, filters?: DeviceStateHistoryFilters): Promise<DeviceStateHistoryResponse> {
    const params = new URLSearchParams();
    if (filters?.fromDate) params.append('from_date', filters.fromDate);
    if (filters?.toDate) params.append('to_date', filters.toDate);
    if (filters?.states) {
      filters.states.forEach(state => params.append('states', state.toString()));
    }
    const url = `/devices/${deviceId}/states/history${params.toString() ? '?' + params.toString() : ''}`;
    return await httpClient.get(url);
  }

  async getDeviceStates(): Promise<DeviceState[]> {
    return await httpClient.get('/devices/states');
  }

  async getDeviceState(id: number): Promise<DeviceState> {
    return await httpClient.get(`/devices/states/${id}`);
  }

  async createDeviceState(data: CreateDeviceStateDTO): Promise<DeviceState> {
    return await httpClient.post('/devices/states', data);
  }

  async updateDeviceState(id: number, data: UpdateDeviceStateDTO): Promise<DeviceState> {
    return await httpClient.put(`/devices/states/${id}`, data);
  }

  async getDevicesByLocation(_locationId: number): Promise<SolarDeviceView[]> {
    const response = await httpClient.get<{ devices: any[] }>('/devices/solar');
    return response.devices.map(dto => ({
      id: dto.id,
      name: dto.name || '',
      charging_current: dto.charging_current || 0,
      battery_voltage: dto.battery_voltage || 0,
      led_status: dto.led_status || 'unknown',
      connected_device_ip: dto.connected_device_ip || null,
      address: dto.address || '',
      city: dto.city || '',
      status: (dto.status || 'unknown') as DeviceStatus,
    }));
  }
}
