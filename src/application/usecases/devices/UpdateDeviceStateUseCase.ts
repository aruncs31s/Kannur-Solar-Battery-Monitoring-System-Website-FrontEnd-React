import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceState, UpdateDeviceStateDTO } from '../../../domain/entities/Device';

export class UpdateDeviceStateUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(id: number, data: UpdateDeviceStateDTO): Promise<DeviceState> {
    return await this.deviceRepository.updateDeviceState(id, data);
  }
}