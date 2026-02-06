import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import {  DeviceResponseDTO } from '../../../domain/entities/Device';

export class GetOfflineDevicesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<DeviceResponseDTO[]> {
    return await this.deviceRepository.getOfflineDevices();
  }
}
