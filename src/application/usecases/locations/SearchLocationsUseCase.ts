import { ILocationRepository } from '../../../domain/repositories/ILocationRepository';
import { LocationResponseDTO } from '../../../domain/entities/Location';

export class SearchLocationsUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(query: string): Promise<LocationResponseDTO[]> {
    return await this.locationRepository.search(query);
  }
}