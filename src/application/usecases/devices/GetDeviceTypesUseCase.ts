import { IDeviceTypesRepository, DeviceTypeDTO } from '../../domain/repositories/IDeviceTypesRepository';

export class GetDeviceTypesUseCase {
  constructor(private deviceTypesRepository: IDeviceTypesRepository) {}

  async execute(): Promise<DeviceTypeDTO[]> {
    return await this.deviceTypesRepository.getAll();
  }
}