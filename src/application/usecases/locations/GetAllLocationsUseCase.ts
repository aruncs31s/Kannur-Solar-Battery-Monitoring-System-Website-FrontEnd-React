import { ILocationRepository } from '../../../domain/repositories/ILocationRepository';
import { LocationResponseDTO } from '../../../domain/entities/Location';

export class GetAllLocationsUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(): Promise<LocationResponseDTO[]> {
    return await this.locationRepository.getAll();
  }
}