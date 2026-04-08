import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { ProgressiveReadingsResponse } from '../../../domain/entities/Reading';

export class GetProgressiveReadingsUseCase {
  constructor(private deviceRepository: IDeviceRepository) { }

  async execute(deviceId: number): Promise<ProgressiveReadingsResponse> {
    return await this.deviceRepository.getProgressiveReadings(deviceId);
  }
}