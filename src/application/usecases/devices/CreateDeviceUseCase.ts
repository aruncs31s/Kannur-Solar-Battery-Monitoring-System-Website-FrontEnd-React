import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { CreateDeviceDTO, DeviceResponseDTO } from '../../../domain/entities/Device';

export class CreateDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(device: CreateDeviceDTO): Promise<DeviceResponseDTO> {
    return await this.deviceRepository.create(device);
  }
}
