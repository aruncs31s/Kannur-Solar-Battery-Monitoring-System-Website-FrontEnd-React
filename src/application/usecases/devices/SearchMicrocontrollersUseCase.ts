import { DeviceSearchResultDTO } from '../../../domain/entities/Device';
import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';

export class SearchMicrocontrollersUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(query: string): Promise<DeviceSearchResultDTO[]> {
    return await this.deviceRepository.searchMicrocontrollers(query);
  }
}