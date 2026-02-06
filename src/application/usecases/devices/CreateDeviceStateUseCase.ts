import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceState, CreateDeviceStateDTO } from '../../../domain/entities/Device';

export class CreateDeviceStateUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(data: CreateDeviceStateDTO): Promise<DeviceState> {
    return await this.deviceRepository.createDeviceState(data);
  }
}