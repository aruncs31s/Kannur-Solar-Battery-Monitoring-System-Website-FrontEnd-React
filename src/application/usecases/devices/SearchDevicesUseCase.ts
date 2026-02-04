import { DeviceResponseDTO } from '../../../domain/entities/Device';
import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class SearchDevicesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(query: string): Promise<DeviceResponseDTO[]> {
    return await this.deviceRepository.search(query);
  }
}
