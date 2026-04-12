import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceOwnership } from '../../../domain/entities/Device';

export class GetDeviceOwnershipUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number): Promise<DeviceOwnership> {
    return await this.deviceRepository.getOwnership(deviceId);
  }
}
