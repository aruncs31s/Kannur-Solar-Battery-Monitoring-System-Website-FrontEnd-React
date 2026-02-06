import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { CreateSensorDeviceDTO, DeviceResponseDTO } from '../../../domain/entities/Device';

export class CreateSensorDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(data: CreateSensorDeviceDTO): Promise<DeviceResponseDTO> {
    return await this.deviceRepository.createSensorDevice(data);
  }
}