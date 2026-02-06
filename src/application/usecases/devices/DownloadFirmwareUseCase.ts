import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class DownloadFirmwareUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(buildId: string): Promise<Blob> {
    return await this.deviceRepository.downloadFirmware(buildId);
  }
}
