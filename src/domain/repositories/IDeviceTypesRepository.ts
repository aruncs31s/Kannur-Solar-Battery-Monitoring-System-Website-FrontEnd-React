export interface DeviceTypeDTO {
  id: number;
  name: string;
}

export interface IDeviceTypesRepository {
  getAll(): Promise<DeviceTypeDTO[]>;
}