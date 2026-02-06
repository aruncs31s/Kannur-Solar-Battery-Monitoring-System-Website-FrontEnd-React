import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { CreateDeviceTypeDTO } from '../../../domain/entities/Device';

export class CreateDeviceTypeUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(data: CreateDeviceTypeDTO): Promise<{ message: string }> {
    return await this.deviceRepository.createDeviceType(data);
  }
}