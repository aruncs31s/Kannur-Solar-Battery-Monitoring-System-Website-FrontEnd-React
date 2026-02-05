import { IDeviceTypesRepository, DeviceTypeDTO } from '../../../domain/entities/Device';

export class GetHardwareDeviceTypesUseCase {
  constructor(private deviceTypesRepository: IDeviceTypesRepository) {}

  async execute(): Promise<DeviceTypeDTO[]> {
    return await this.deviceTypesRepository.getHardwareTypes();
  }
}