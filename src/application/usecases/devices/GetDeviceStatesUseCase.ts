import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceState } from '../../../domain/entities/Device';

export class GetDeviceStatesUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<DeviceState[]> {
    return await this.deviceRepository.getDeviceStates();
  }
}