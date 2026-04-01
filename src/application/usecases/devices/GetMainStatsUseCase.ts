import { MainStatsDTO } from '../../../domain/entities/Device';
import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class GetMainStatsUseCase {
  constructor(private deviceRepository: IDeviceRepository) { }

  async execute(): Promise<MainStatsDTO> {
    return await this.deviceRepository.getMainStats();
  }
}
