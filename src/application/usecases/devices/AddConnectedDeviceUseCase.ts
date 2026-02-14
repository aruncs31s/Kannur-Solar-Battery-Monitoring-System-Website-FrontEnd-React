import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class AddConnectedDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, childId: number): Promise<{ message: string }> {
    return this.deviceRepository.addConnectedDevice(deviceId, childId);
  }
}
