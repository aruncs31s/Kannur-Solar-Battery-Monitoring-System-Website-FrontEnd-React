// Hardware type enum mirrors backend model/device_types.go
export enum HardwareType {
  Unknown = 0,
  MicroController = 1,
  SingleBoardComputer = 2,
  Sensor = 3,
  Solar = 4,           // MPPT Solar Charger — TOP LEVEL
  VoltageMeter = 5,
  CurrentSensor = 6,
  PowerMeter = 7,
  Actuator = 8,
}

export const isSolarHardwareType = (ht: number) => ht === HardwareType.Solar;
export const isMCHardwareType = (ht: number) => ht === HardwareType.MicroController || ht === HardwareType.SingleBoardComputer;
export const isSensorHardwareType = (ht: number) => [HardwareType.Sensor, HardwareType.VoltageMeter, HardwareType.CurrentSensor, HardwareType.PowerMeter].includes(ht);
export const isActuatorHardwareType = (ht: number) => ht === HardwareType.Actuator;

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
    public status: string,
    public device_state: number,
    public hardware_type?: number
  ) { }
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
  status: string;
  device_state: number;
  hardware_type?: number;
}

export type DeviceStatus = "active" | "inactive" | "error" | "maintenance" | "decommissioned" | "unknown";

const DEVICE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ERROR: "error",
  MAINTENANCE: "maintenance",
  DISCOMMISSIONED: "decommissioned",
  UNKNOWN: "unknown",
}

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
  // For nested hierarchy — sensors connected to this MC
  connected_sensors?: ConnectedDeviceDTO[];
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

export interface MainStatsDTO {
  total_devices: number;
  active_devices: number;
  avg_voltage: number;
  avg_current: number;
  avg_power: number;
}

// Full Solar Device detail with connected microcontrollers and their sensors
export interface SolarDeviceDetailDTO extends DeviceResponseDTO {
  device_type_name?: string;
  connected_microcontrollers: ConnectedDeviceDTO[];
}

// Summary reading info for a device
export interface DeviceLatestReadingDTO {
  device_id: number;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  timestamp?: number;
}
