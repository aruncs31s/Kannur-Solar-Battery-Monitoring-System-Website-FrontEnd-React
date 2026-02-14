import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { CreateConnectedDeviceDTO } from '../../../domain/entities/Device';

export class CreateAndConnectDeviceUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, data: CreateConnectedDeviceDTO): Promise<{ message: string }> {
    return this.deviceRepository.createAndConnectDevice(deviceId, data);
  }
}
