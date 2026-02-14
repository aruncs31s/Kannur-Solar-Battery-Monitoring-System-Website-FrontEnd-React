
export class Device {
  constructor(
    public id: number,
    public name: string,
    public type: string,
    public ip_address: string,
    public mac_address: string,
    public firmware_version: string,
    public version_id: number,
    public address: string,
    public city: string,
    public device_state: number
  ) {}
}



export interface DeviceResponseDTO {
  id: number;
  name: string;
  type: string;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  version_id: number;
  address: string;
  city: string;
  device_state: number;
}

export type DeviceStatus = "active" | "inactive" | "error" | "maintenance" | "decommissioned" | "unknown";

export type DeviceStates = {
  [key: number]: DeviceStatus;
};

export interface CreateDeviceDTO {
  name: string;
  type: number;
  ip_address: string;
  mac_address: string;
  firmware_version_id: number;
  address: string;
  city: string;
}

export interface CreateSolarDeviceDTO {
  name: string;
  device_type_id: number;
  address: string;
  city: string;
  connected_microcontroller_id: number;
}

export interface CreateSensorDeviceDTO {
  name: string;
  type: number;
  ip_address?: string;
  mac_address?: string;
  firmware_version_id?: number;
  address?: string;
  city?: string;
}

export interface SolarDeviceView {
  id: number;
  name: string;
  charging_current: number;
  battery_voltage: number;
  led_status: string;
  connected_device_ip: string;
  address: string;
  city: string;
  status: DeviceStatus;
}

export interface DeviceSearchResultDTO {
  id: number;
  name: string;
}

export interface DeviceTypeDTO {
  id: number;
  name: string;
  features?: {
    can_control?: boolean;
  };
}

export interface UpdateDeviceDTO {
  name: string;
  type: number;
  ip_address: string;
  mac_address: string;
  firmware_version_id: number;
  address: string;
  city: string;
}

export interface MicrocontrollerDTO {
  id: number;
  parent_id: number;
  name: string;
  ip_address: string;
  mac_address: string;
  status: string;
  used_by: string;
  firmware_version: string;
  connected_sensors: any | null;
}

export interface DeviceStateHistoryEntry {
  state_name: string;
  action_caused: string;
  changed_at: string;
  changed_by: string;
}

export interface DeviceStateHistoryResponse {
  history: DeviceStateHistoryEntry[];
  total_records: number;
}

export interface DeviceStateHistoryFilters {
  fromDate?: string;
  toDate?: string;
  states?: number[];
}

export interface CreateDeviceTypeDTO {
  name: string;
  hardware_type: number;
}

export interface DeviceState {
  id: number;
  name: string;
  description?: string;
}

export interface CreateDeviceStateDTO {
  name: string;
  description?: string;
}

export interface UpdateDeviceStateDTO {
  name?: string;
  description?: string;
}

export interface ConnectedDeviceDTO {
  id: number;
  name: string;
  type: string;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  address: string;
  city: string;
  device_state: number;
  hardware_type?: number;
}

export interface AddConnectedDeviceDTO {
  child_id: number;
}

export interface CreateConnectedDeviceDTO {
  name: string;
  type: number;
  ip_address?: string;
  mac_address?: string;
}

export interface IDeviceTypesRepository {
  getAll(): Promise<DeviceTypeDTO[]>;
  getHardwareTypes(): Promise<DeviceTypeDTO[]>;
}
