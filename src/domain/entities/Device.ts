/**
 * Hardware type enum that categorizes devices based on their physical implementation and purpose.
 * Mirrors the backend model in `internal/model/device_types.go`.
 */
export enum HardwareType {
  /** Unspecified or unknown hardware type */
  Unknown = 0,
  /** General purpose microcontroller (e.g., ESP32, Arduino) */
  MicroController = 1,
  /** More powerful standalone computer (e.g., Raspberry Pi) */
  SingleBoardComputer = 2,
  /** Generic environmental or physical sensor */
  Sensor = 3,
  /** MPPT Solar Charge Controller - Considered a top-level device in hierarchy */
  Solar = 4,
  /** Dedicated voltage measurement sensor */
  VoltageMeter = 5,
  /** Dedicated current measurement sensor */
  CurrentSensor = 6,
  /** Combination sensor measuring both voltage and current */
  PowerMeter = 7,
  /** Device that performs physical actions (e.g., relays, switches) */
  Actuator = 8,
}

/**
 * Helper to check if a hardware type ID corresponds to a Solar device.
 */
export const isSolarHardwareType = (ht: number) => ht === HardwareType.Solar;

/**
 * Helper to check if a hardware type ID corresponds to a main controller/gateway.
 */
export const isMCHardwareType = (ht: number) => ht === HardwareType.MicroController || ht === HardwareType.SingleBoardComputer;

/**
 * Helper to check if a hardware type ID corresponds to any sensor type.
 */
export const isSensorHardwareType = (ht: number) => [HardwareType.Sensor, HardwareType.VoltageMeter, HardwareType.CurrentSensor, HardwareType.PowerMeter].includes(ht);

/**
 * Helper to check if a hardware type ID corresponds to an actuator.
 */
export const isActuatorHardwareType = (ht: number) => ht === HardwareType.Actuator;

/**
 * Domain entity representing a physical or virtual device in the system.
 */
export class Device {
  constructor(
    /** Unique database identifier */
    public id: number,
    /** Human-readable name of the device */
    public name: string,
    /** Categorization string (e.g., "Solar Charger") */
    public type: string,
    /** Network IP address */
    public ip_address: string,
    /** Hardware MAC address */
    public mac_address: string,
    /** Semantic version of the installed firmware */
    public firmware_version: string,
    /** ID referencing the firmware version in the DB */
    public version_id: number,
    /** Specific location address */
    public address: string,
    /** City where device is located */
    public city: string,
    /** Operational status string (e.g., "online", "offline") */
    public status: string,
    /** Current operational state ID */
    public device_state: number,
    /** Categorization ID (mirrors HardwareType enum) */
    public hardware_type?: number
  ) { }
}

/**
 * Data Transfer Object for device information returned by the API.
 */
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

/**
 * Valid operational status strings for devices.
 */
export type DeviceStatus = "active" | "inactive" | "error" | "maintenance" | "decommissioned" | "unknown";

/**
 * Mapping of device state identifiers to their semantic meanings.
 * Mirrors the backend `DeviceStateMap` in `model/device.go`.
 */
export const DEVICE_STATE_IDS = {
  ACTIVE: 1,
  INACTIVE: 2,
  MAINTENANCE: 3,
  DECOMMISSIONED: 4,
  INITIALIZED: 5,
} as const;

/**
 * Display labels for various device states.
 */
export const DEVICE_STATES = {
  [DEVICE_STATE_IDS.ACTIVE]: 'Active',
  [DEVICE_STATE_IDS.INACTIVE]: 'InActive',
  [DEVICE_STATE_IDS.MAINTENANCE]: 'Maintenance',
  [DEVICE_STATE_IDS.DECOMMISSIONED]: 'Decommissioned',
  [DEVICE_STATE_IDS.INITIALIZED]: 'Initialized',
} as const;

/**
 * Command actions that can be sent to a device.
 * Mirrors the backend `DeviceAction` enum in `model/device.go`.
 */
export const DEVICE_ACTIONS = {
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3,
  TURN_ON: 4,
  TURN_OFF: 5,
  CONFIGURE: 6,
} as const;

/**
 * Legacy status strings (preferred to use DeviceStatus type).
 */
export const DEVICE_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "InActive",
  ERROR: "Error",
  MAINTENANCE: "Maintenance",
  DISCOMMISSIONED: "Decommissioned",
  UNKNOWN: "Unknown",
}

/**
 * Maps numeric state IDs to normalized status strings used in UI styling.
 */
export const DEVICE_STATE_MAPPING: Record<number, DeviceStatus> = {
  [DEVICE_STATE_IDS.ACTIVE]: 'active',
  [DEVICE_STATE_IDS.INACTIVE]: 'inactive',
  [DEVICE_STATE_IDS.MAINTENANCE]: 'maintenance',
  [DEVICE_STATE_IDS.DECOMMISSIONED]: 'decommissioned',
  [DEVICE_STATE_IDS.INITIALIZED]: 'active',
};

/**
 * Type representing the full mapping of states to statuses.
 */
export type DeviceStates = {
  [key: number]: DeviceStatus;
};

/**
 * DTO for creating a new base device (Microcontroller).
 */
export interface CreateDeviceDTO {
  name: string;
  /** Reference to the DeviceType ID */
  type: number;
  ip_address: string;
  mac_address: string;
  firmware_version_id: number;
  address: string;
  city: string;
}

/**
 * DTO for creating a new Solar monitoring device.
 */
export interface CreateSolarDeviceDTO {
  name: string;
  device_type_id: number;
  address: string;
  city: string;
  /** The ID of the parent microcontroller this solar device is connected to */
  connected_microcontroller_id: number;
  /** Optional reference to the location record */
  location_id?: number;
}

/**
 * DTO for creating a new independent sensor.
 */
export interface CreateSensorDeviceDTO {
  name: string;
  type: number;
  ip_address?: string;
  mac_address?: string;
  firmware_version_id?: number;
  address?: string;
  city?: string;
}

/**
 * Aggregated view of a solar device including real-time reading data.
 */
export interface SolarDeviceView {
  id: number;
  name: string;
  /** Real-time charging current in Amperes */
  charging_current: number;
  /** Real-time battery voltage in Volts */
  battery_voltage: number;
  /** Status text for physical LED indicators */
  led_status: string;
  /** Network IP of the managing controller */
  connected_device_ip: string;
  address: string;
  city: string;
  /** Current operational status */
  status: DeviceStatus;
}

/**
 * Lightweight DTO for search results or picklists.
 */
export interface DeviceSearchResultDTO {
  id: number;
  name: string;
}

/**
 * Metadata about a device type, including feature flags.
 */
export interface DeviceTypeDTO {
  id: number;
  name: string;
  features?: {
    /** Whether the system can send control commands to this type of device */
    can_control?: boolean;
  };
}

/**
 * DTO for updating an existing device's core information.
 */
export interface UpdateDeviceDTO {
  name: string;
  type: number;
  ip_address: string;
  mac_address: string;
  firmware_version_id: number;
  address: string;
  city: string;
}

/**
 * Detailed representation of a Microcontroller and its environment.
 */
export interface MicrocontrollerDTO {
  id: number;
  /** ID of the parent device if nested */
  parent_id: number;
  name: string;
  ip_address: string;
  mac_address: string;
  status: string;
  /** Information about the primary consumer/user of this MC */
  used_by: string;
  firmware_version: string;
  /** Serialized or nested sensors connected to this MC */
  connected_sensors: any | null;
}

/**
 * Represents a single audit entry for a device's state change history.
 */
export interface DeviceStateHistoryEntry {
  /** Name of the state transitioned to */
  state_name: string;
  /** The command that triggered this transition */
  action_caused: string;
  /** ISO timestamp of the change */
  changed_at: string;
  /** Username of the person or system that initiated the change */
  changed_by: string;
}

/**
 * Paginated response for device state history.
 */
export interface DeviceStateHistoryResponse {
  history: DeviceStateHistoryEntry[];
  total_records: number;
}

/**
 * Search and filter criteria for device history lookups.
 */
export interface DeviceStateHistoryFilters {
  /** Start date filter */
  fromDate?: string;
  /** End date filter */
  toDate?: string;
  /** Filter by specific state IDs */
  states?: number[];
}

/**
 * DTO for registerng a new hardware category or device type.
 */
export interface CreateDeviceTypeDTO {
  name: string;
  /** The specific HardwareType identifier */
  hardware_type: number;
}

/**
 * Representation of a managed device state.
 */
export interface DeviceState {
  id: number;
  name: string;
  /** Detailed description of what this state represents */
  description?: string;
}

/**
 * DTO for creating a new operational state.
 */
export interface CreateDeviceStateDTO {
  name: string;
  description?: string;
}

/**
 * DTO for updating existing state definitions.
 */
export interface UpdateDeviceStateDTO {
  name?: string;
  description?: string;
}

/**
 * Represents a device in a parent-child relationship (e.g., a multi-sensor node).
 */
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
  /** Sensors or modules nested under this device */
  connected_sensors?: ConnectedDeviceDTO[];
}

/**
 * Simple payload for associating a child device with a parent.
 */
export interface AddConnectedDeviceDTO {
  child_id: number;
}

/**
 * Payload for creating and instantly connecting a new child device.
 */
export interface CreateConnectedDeviceDTO {
  name: string;
  type: number;
  ip_address?: string;
  mac_address?: string;
}

/**
 * Interface definition for device categorization repository.
 */
export interface IDeviceTypesRepository {
  getAll(): Promise<DeviceTypeDTO[]>;
  getHardwareTypes(): Promise<DeviceTypeDTO[]>;
}

/**
 * Dashboard-level aggregation of device counts and average readings.
 */
export interface MainStatsDTO {
  total_devices: number;
  active_devices: number;
  /** System-wide average battery voltage */
  avg_voltage: number;
  /** System-wide average charging current */
  avg_current: number;
  /** System-wide average power output */
  avg_power: number;
}

/**
 * Information regarding a device's assigned owner and public visibility status.
 */
export interface DeviceOwnership {
  id: number;
  device_id: number;
  /** Unique ID of the owning user */
  owner_id: number;
  /** Full name or username of the owner */
  owner_name: string;
  /** Whether the device data is accessible to all users */
  is_public: boolean;
}

/**
 * Formal request payload for transferring device ownership to another user.
 */
export interface TransferOwnershipDTO {
  /** ID of the user who will become the new owner */
  to_user_id: number;
  /** Context or reason for the transfer */
  note: string;
}

/**
 * Full hierarchal view of a Solar device, including connected controllers and their sensor arrays.
 */
export interface SolarDeviceDetailDTO extends DeviceResponseDTO {
  device_type_name?: string;
  /** List of microcontrollers facilitating this solar device */
  connected_microcontrollers: ConnectedDeviceDTO[];
}

/**
 * Snapshot of the most recent telemetry data received from a device.
 */
export interface DeviceLatestReadingDTO {
  device_id: number;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  /** Unix timestamp of the reading */
  timestamp?: number;
}
