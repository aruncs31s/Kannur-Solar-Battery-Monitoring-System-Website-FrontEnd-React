import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { UpdateDeviceDTO, DeviceResponseDTO } from '../../../domain/entities/Device';

export class UpdateDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO> {
    return await this.deviceRepository.updateDevice(deviceId, data);
  }
}
