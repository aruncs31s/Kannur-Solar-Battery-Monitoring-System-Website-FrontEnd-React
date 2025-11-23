import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { Device, CreateDeviceDTO } from '../../../domain/entities/Device';

export class CreateDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(device: CreateDeviceDTO): Promise<Device> {
    return await this.deviceRepository.create(device);
  }
}
