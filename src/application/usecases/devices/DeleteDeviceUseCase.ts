import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class DeleteDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number): Promise<void> {
    return await this.deviceRepository.deleteDevice(deviceId);
  }
}
