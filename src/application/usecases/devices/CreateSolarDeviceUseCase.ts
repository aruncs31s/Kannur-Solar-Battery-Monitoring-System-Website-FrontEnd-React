import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceResponseDTO, CreateSolarDeviceDTO } from '../../../domain/entities/Device';

export class CreateSolarDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(device: CreateSolarDeviceDTO): Promise<DeviceResponseDTO> {
    return await this.deviceRepository.createSolarDevice(device);
  }
}