import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { MicrocontrollerStats } from '../../../api/devices';

export class GetMicrocontrollerStatsUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<MicrocontrollerStats> {
    return await this.deviceRepository.getMicrocontrollerStats();
  }
}