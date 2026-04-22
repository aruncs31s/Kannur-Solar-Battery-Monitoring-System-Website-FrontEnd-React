import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { SolarDeviceWithType } from '../../../domain/entities/Device';

export class GetDevicesByLocationUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(locationId: number): Promise<SolarDeviceWithType[]> {
    return await this.deviceRepository.getDevicesByLocation(locationId);
  }
}