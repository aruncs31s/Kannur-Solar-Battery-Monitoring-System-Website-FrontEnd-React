import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { SolarDeviceView } from '../../../domain/entities/Device';

export class GetDevicesByLocationUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(locationId: number): Promise<SolarDeviceView[]> {
    return await this.deviceRepository.getDevicesByLocation(locationId);
  }
}