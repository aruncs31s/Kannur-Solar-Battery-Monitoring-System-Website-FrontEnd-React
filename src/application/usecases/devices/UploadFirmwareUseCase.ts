import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class UploadFirmwareUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, firmwareFile: File): Promise<{ message: string }> {
    return await this.deviceRepository.uploadFirmware(deviceId, firmwareFile);
  }
}