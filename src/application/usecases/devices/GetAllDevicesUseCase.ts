import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { Device } from '../../../domain/entities/Device';

export class GetAllDevicesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<Device[]> {
    return await this.deviceRepository.getAll();
  }
}
