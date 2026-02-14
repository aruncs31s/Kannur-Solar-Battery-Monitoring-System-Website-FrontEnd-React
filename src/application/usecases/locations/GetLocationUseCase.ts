import { ILocationRepository } from '../../../domain/repositories/ILocationRepository';
import { LocationResponseDTO } from '../../../domain/entities/Location';

export class GetLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: number): Promise<LocationResponseDTO> {
    return await this.locationRepository.getById(id);
  }
}