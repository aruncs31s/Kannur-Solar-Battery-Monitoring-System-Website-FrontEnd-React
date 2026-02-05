import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class ControlDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, action: number): Promise<{ success: boolean; message: string }> {
    return await this.deviceRepository.controlDevice(deviceId, action);
  }
}
