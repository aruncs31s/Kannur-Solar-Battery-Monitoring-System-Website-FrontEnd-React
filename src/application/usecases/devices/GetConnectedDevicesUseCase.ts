import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { ConnectedDeviceDTO } from '../../../domain/entities/Device';

export class GetConnectedDevicesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number): Promise<ConnectedDeviceDTO[]> {
    return this.deviceRepository.getConnectedDevices(deviceId);
  }
}
