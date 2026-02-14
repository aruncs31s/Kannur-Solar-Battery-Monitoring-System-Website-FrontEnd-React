import { ILocationRepository } from '../../../domain/repositories/ILocationRepository';

export class DeleteLocationUseCase {
  constructor(private locationRepository: ILocationRepository) {}

  async execute(id: number): Promise<{ message: string }> {
    return await this.locationRepository.delete(id);
  }
}