import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceTypeDTO } from '../../../domain/entities/Device';

export class GetDeviceTypeUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number): Promise<DeviceTypeDTO> {
    return await this.deviceRepository.getDeviceType(deviceId);
  }
}
