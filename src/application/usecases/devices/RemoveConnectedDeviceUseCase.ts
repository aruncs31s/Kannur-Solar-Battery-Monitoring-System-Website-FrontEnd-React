import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class RemoveConnectedDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, connectedDeviceId: number): Promise<{ success: boolean; message: string }> {
    return await this.deviceRepository.removeConnectedDevice(deviceId, connectedDeviceId);
  }
}