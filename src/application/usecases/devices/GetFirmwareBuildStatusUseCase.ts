import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class GetFirmwareBuildStatusUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(buildId: string): Promise<any> {
    return await this.deviceRepository.getFirmwareBuildStatus(buildId);
  }
}
