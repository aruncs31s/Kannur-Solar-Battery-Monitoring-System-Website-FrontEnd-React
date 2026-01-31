import { IReadingRepository } from '../../domain/repositories/IReadingRepository';
import { Reading, ReadingFilters } from '../../domain/entities/Reading';
import { httpClient } from '../http/HttpClient';

export class ReadingRepository implements IReadingRepository {
  async getByDevice(deviceId: string): Promise<Reading[]> {
    const response = await httpClient.get<any[]>(`/devices/${deviceId}/readings`);
    return response.map(dto => ({
      id: dto.id.toString(),
      deviceId: dto.device_id.toString(),
      voltage: dto.voltage,
      current: dto.current,
      power: dto.power,
      temperature: dto.temperature,
      humidity: dto.humidity,
      timestamp: new Date(dto.timestamp).getTime(),
    }));
  }

  async getByDateRange(filters: ReadingFilters): Promise<Reading[]> {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    const response = await httpClient.get<any[]>(
      `/devices/${filters.deviceId}/readings/range?${params.toString()}`
    );
    return response.map(dto => ({
      id: dto.id.toString(),
      deviceId: dto.device_id.toString(),
      voltage: dto.voltage,
      current: dto.current,
      power: dto.power,
      temperature: dto.temperature,
      humidity: dto.humidity,
      timestamp: new Date(dto.timestamp).getTime(),
    }));
  }
}
