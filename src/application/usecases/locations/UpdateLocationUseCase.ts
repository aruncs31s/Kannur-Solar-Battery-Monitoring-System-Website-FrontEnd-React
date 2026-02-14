import { ILocationRepository } from '../../../domain/repositories/ILocationRepository';
import { UpdateLocationDTO } from '../../../domain/entities/Location';

export class UpdateLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: number, location: UpdateLocationDTO): Promise<{ message: string }> {
    return await this.locationRepository.update(id, location);
  }
}