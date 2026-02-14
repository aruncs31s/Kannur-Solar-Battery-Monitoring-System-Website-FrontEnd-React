import { ILocationRepository } from '../../../domain/repositories/ILocationRepository';
import { LocationDeviceDTO } from '../../../domain/entities/Location';

export class GetDevicesByLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(locationId: number): Promise<LocationDeviceDTO[]> {
    return await this.locationRepository.getDevicesByLocation(locationId);
  }
}