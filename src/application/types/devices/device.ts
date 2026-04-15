
export interface DeviceCoreDTO {
  id: number;
  name: string;
  type: string;
  status: number;
}
/**
 * Data Transfer Object for device information returned by the API.
 */
export interface DeviceResponseDTO {
  id: number;
  name: string;
  type: string;
  status: number;
  ip_address?: string;
  mac_address?: string;
  firmware_version?: string;
  version_id?: number;
  address?: string;
  city?: string;
  hardware_type?: number;
  device_state: number;
}


export interface DeviceWithVersionDTO extends DeviceCoreDTO {
  version_id: number;
}

export interface MicrocontrollerDeviceDTO extends DeviceCoreDTO {
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  version_id: number;
}

export interface SolarDeviceDTO extends DeviceCoreDTO {
  address: string;
  city: string;
}
export interface MinimalDeviceDTO {
  id: number;
  name: string;
  type: string;
}
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