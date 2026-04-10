import { Reading, ReadingFilters, AdvancedReadingFilterDTO, AdvancedReadingViewResponseDTO } from '../entities/Reading';

export interface IReadingRepository {
  getByDevice(deviceId: string, limit?: number): Promise<Reading[]>;
  getByDateRange(filters: ReadingFilters): Promise<Reading[]>;
  getSevenDaysByLocation(locationId: number): Promise<Reading[]>;
  getAdvancedReadings(filters: AdvancedReadingFilterDTO): Promise<AdvancedReadingViewResponseDTO>;
}
