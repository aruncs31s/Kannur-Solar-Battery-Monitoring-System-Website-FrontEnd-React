import { ILocationRepository } from '../../../domain/repositories/ILocationRepository';
import { CreateLocationDTO } from '../../../domain/entities/Location';

export class CreateLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(location: CreateLocationDTO): Promise<{ message: string }> {
    return await this.locationRepository.create(location);
  }
}