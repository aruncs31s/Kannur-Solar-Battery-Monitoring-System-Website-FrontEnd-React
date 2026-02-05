import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import {  DeviceResponseDTO } from '../../../domain/entities/Device';

export class GetRecentDevicesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<DeviceResponseDTO[]> {
    return await this.deviceRepository.getRecentDevices();
  }
}
