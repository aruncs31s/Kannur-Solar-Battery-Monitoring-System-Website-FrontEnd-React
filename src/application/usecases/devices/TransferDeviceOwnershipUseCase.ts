import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { TransferOwnershipDTO } from '../../../domain/entities/Device';

export class TransferDeviceOwnershipUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, data: TransferOwnershipDTO): Promise<void> {
    return await this.deviceRepository.transferOwnership(deviceId, data);
  }
}
