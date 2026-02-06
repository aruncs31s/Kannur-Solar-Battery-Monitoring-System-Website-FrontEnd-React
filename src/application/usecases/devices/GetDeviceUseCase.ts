import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class GetDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: string | number): Promise<{ device: any }> {
    return await this.deviceRepository.getDevice(deviceId);
  }
}