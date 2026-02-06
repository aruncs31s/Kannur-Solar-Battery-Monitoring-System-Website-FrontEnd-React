import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { MicrocontrollerDTO } from '../../../domain/entities/Device';

export class GetMicrocontrollersUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(): Promise<MicrocontrollerDTO[]> {
    return await this.deviceRepository.getMicrocontrollers();
  }
}
