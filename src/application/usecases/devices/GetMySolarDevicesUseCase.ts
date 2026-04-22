import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { SolarDeviceWithType } from '../../../domain/entities/Device';

export class GetMySolarDevicesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<SolarDeviceWithType[]> {
    return await this.deviceRepository.getMySolarDevices();
  }
}