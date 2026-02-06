import { IDeviceRepository } from '../../../domain/repositories/IDeviceRepository';
import { DeviceStateHistoryResponse, DeviceStateHistoryFilters } from '../../../domain/entities/Device';

export class GetDeviceStateHistoryUseCase {
  constructor(private deviceRepository: IDeviceRepository) {}

  async execute(deviceId: string | number, filters?: DeviceStateHistoryFilters): Promise<DeviceStateHistoryResponse> {
    return await this.deviceRepository.getDeviceStateHistory(deviceId, filters);
  }
}