import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class BuildFirmwareUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(config: any): Promise<any> {
    return await this.deviceRepository.buildFirmware(config);
  }
}
