import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { Reading } from '../../../domain/entities/Reading';

export class GetProgressiveReadingsUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number): Promise<Reading[]> {
    return await this.deviceRepository.getProgressiveReadings(deviceId);
  }
}