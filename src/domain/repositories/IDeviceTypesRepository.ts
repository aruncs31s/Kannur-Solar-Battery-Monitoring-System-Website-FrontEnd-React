import { DeviceTypeDTO } from "../../application/types/devices/device";

/**
 * Interface definition for device categorization repository.
 */
export interface IDeviceTypesRepository {
  getAll(): Promise<DeviceTypeDTO[]>;
  getHardwareTypes(): Promise<DeviceTypeDTO[]>;
}
