import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class SetDeviceVisibilityUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: number, isPublic: boolean): Promise<void> {
    return await this.deviceRepository.setVisibility(deviceId, isPublic);
  }
}
