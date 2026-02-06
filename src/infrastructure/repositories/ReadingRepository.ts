import { IReadingRepository } from '../../domain/repositories/IReadingRepository';
import { Reading, ReadingFilters } from '../../domain/entities/Reading';
import { httpClient } from '../http/HttpClient';

export class ReadingRepository implements IReadingRepository {
  async getByDevice(deviceId: string, limit?: number): Promise<Reading[]> {
    const url = limit ? `/devices/${deviceId}/readings?limit=${limit}` : `/devices/${deviceId}/readings`;
    const response = await httpClient.get<{ readings: any[]; latest: any }>(url);
    return response.readings.map(dto => ({
      id: dto.id.toString(),
      deviceId: dto.device_id.toString(),
      voltage: dto.voltage,
      current: dto.current,
      power: dto.voltage && dto.current ? dto.voltage * dto.current : undefined,
      temperature: undefined, // Not available in backend
      humidity: undefined,    // Not available in backend
      timestamp: new Date(dto.created_at).getTime(),
    }));
  }

  async getByDateRange(filters: ReadingFilters): Promise<Reading[]> {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    const response = await httpClient.get<{ readings: any[]; stats?: any }>(
      `/devices/${filters.deviceId}/readings/range?${params.toString()}`
    );
    
    // Backend returns { readings: [...], stats: {...} }
    return response.readings.map(dto => ({
      id: dto.id.toString(),
      deviceId: dto.device_id.toString(),
      voltage: dto.voltage,
      current: dto.current,
      power: dto.voltage && dto.current ? dto.voltage * dto.current : undefined,
      temperature: undefined,
      humidity: undefined,
      timestamp: new Date(dto.created_at).getTime(),
    }));
  }
}
