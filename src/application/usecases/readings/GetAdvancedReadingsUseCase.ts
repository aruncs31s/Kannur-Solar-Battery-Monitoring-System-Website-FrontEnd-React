import { IReadingRepository } from '../../../domain/repositories/IReadingRepository';
import { AdvancedReadingFilterDTO, AdvancedReadingViewResponseDTO } from '../../../domain/entities/Reading';

export class GetAdvancedReadingsUseCase {
  constructor(private readonly readingRepository: IReadingRepository) {}

  async execute(filters: AdvancedReadingFilterDTO): Promise<AdvancedReadingViewResponseDTO> {
    // Validate filters
    if (filters.limit && filters.limit <= 0) {
      filters.limit = 100; // Default sensible fallback
    }

    // Call repository to fetch data
    return await this.readingRepository.getAdvancedReadings(filters);
  }
}
