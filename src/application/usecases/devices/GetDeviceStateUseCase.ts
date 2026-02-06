import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceState } from '../../../domain/entities/Device';

export class GetDeviceStateUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(id: number): Promise<DeviceState> {
    return await this.deviceRepository.getDeviceState(id);
  }
}