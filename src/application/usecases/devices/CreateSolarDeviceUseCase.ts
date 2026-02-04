import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { Device, CreateSolarDeviceDTO } from '../../../domain/entities/Device';

export class CreateSolarDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(device: CreateSolarDeviceDTO): Promise<Device> {
    return await this.deviceRepository.createSolarDevice(device);
  }
}