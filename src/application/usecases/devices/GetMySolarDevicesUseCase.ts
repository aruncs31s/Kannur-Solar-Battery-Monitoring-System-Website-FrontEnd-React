import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { SolarDeviceView } from '../../../domain/entities/Device';

export class GetMySolarDevicesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<SolarDeviceView[]> {
    return await this.deviceRepository.getMySolarDevices();
  }
}