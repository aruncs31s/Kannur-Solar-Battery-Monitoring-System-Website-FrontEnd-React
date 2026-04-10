import { IReadingRepository } from '../../domain/repositories/IReadingRepository';
import { Reading, ReadingFilters, AdvancedReadingFilterDTO, AdvancedReadingViewResponseDTO } from '../../domain/entities/Reading';
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

  async getSevenDaysByLocation(locationId: number): Promise<Reading[]> {
    const response = await httpClient.get<{ readings: any[] }>(
      `/locations/${locationId}/readings/seven`
    );

    return response.readings.map(dto => ({
      id: dto.id?.toString() || `location-${locationId}-${dto.created_at}`,
      deviceId: `location-${locationId}`, // Since this is location-based, not device-specific
      voltage: dto.voltage,
      current: dto.current,
      power: dto.voltage && dto.current ? dto.voltage * dto.current : undefined,
      temperature: undefined,
      humidity: undefined,
      timestamp: new Date(dto.created_at).getTime(),
    }));
  }

  async getAdvancedReadings(filters: AdvancedReadingFilterDTO): Promise<AdvancedReadingViewResponseDTO> {
    const params = new URLSearchParams();
    if (filters.location_id) params.append('location_id', filters.location_id.toString());
    if (filters.ip_address) params.append('ip_address', filters.ip_address);
    if (filters.start_time) params.append('start_time', filters.start_time);
    if (filters.end_time) params.append('end_time', filters.end_time);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.interval) params.append('interval', filters.interval);

    try {
      const response = await httpClient.get<AdvancedReadingViewResponseDTO>(
        `/readings?${params.toString()}`
      );
      
      // Map API response to expected DTO output
      return {
        readings: (response.readings || []).map(r => ({
          ...r,
          // Ensure formatting of timestamp if necessary, assuming backend returns string
          timestamp: new Date(r.timestamp).toISOString() 
        })),
        total: response.total || 0
      };
    } catch (error) {
       console.error("Error fetching advanced readings", error);
       throw error;
    }
  }
}

