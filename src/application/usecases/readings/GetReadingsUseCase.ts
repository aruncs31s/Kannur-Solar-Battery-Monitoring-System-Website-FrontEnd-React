import { Reading, ReadingFilters } from '../../../domain/entities/Reading';
import { IReadingRepository } from '../../../domain/repositories/IReadingRepository';

export class GetDeviceReadingsUseCase {
  constructor(private readingRepository: IReadingRepository) {}

  async execute(deviceId: string): Promise<Reading[]> {
    return await this.readingRepository.getByDevice(deviceId);
  }
}

export class GetReadingsByDateRangeUseCase {
  constructor(private readingRepository: IReadingRepository) {}

  async execute(filters: ReadingFilters): Promise<Reading[]> {
    return await this.readingRepository.getByDateRange(filters);
  }
}
