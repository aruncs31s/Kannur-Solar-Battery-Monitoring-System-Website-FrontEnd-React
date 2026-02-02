import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceTokenResponse } from '../../../api/devices';

export class GenerateDeviceTokenUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number): Promise<DeviceTokenResponse> {
    return await this.deviceRepository.generateDeviceToken(deviceId);
  }
}