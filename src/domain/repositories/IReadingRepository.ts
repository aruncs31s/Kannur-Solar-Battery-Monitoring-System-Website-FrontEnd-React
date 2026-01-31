import { Reading, ReadingFilters } from '../entities/Reading';

export interface IReadingRepository {
  getByDevice(deviceId: string): Promise<Reading[]>;
  getByDateRange(filters: ReadingFilters): Promise<Reading[]>;
}
