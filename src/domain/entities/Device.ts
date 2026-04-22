
export class Device {
  constructor(
    public id: number,
    public name: string,
    public type: string,
    public status: number,
  ) {}
}

export class MicrocontrollerDevice extends Device {
  constructor(
    id: number,
    name: string,
    type: string,
    public ip_address: string,
    public mac_address: string,
    public firmware_version: string,
    public version_id: number,
    status: number,
  ) {
    super(id, name, type, status);
  }
}

export class SolarDevice extends Device {
  constructor(
    id: number,
    name: string,
    type: string,
    public address: string,
    public city: string,
    status: number,
  ) {
    super(id, name, type, status);
  }
}


/**
 * Valid operational status strings for devices.
 */
export type DeviceStatus = "active" | "inactive" | "error" | "maintenance" | "decommissioned" | "unknown" | "online";

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

// -----------------------------------------------------------------------------
// Compatibility re-exports for existing import paths
// -----------------------------------------------------------------------------
export type {
  DeviceCoreDTO,
  DeviceResponseDTO,
  DeviceWithVersionDTO,
  MicrocontrollerDeviceDTO,
  SolarDeviceDTO,
  MinimalDeviceDTO,
  CreateDeviceDTO,
  CreateSolarDeviceDTO,
  CreateSensorDeviceDTO,
  DeviceSearchResultDTO,
  DeviceTypeDTO,
  UpdateDeviceDTO,
  DeviceStateHistoryResponse,
  DeviceStateHistoryFilters,
  CreateDeviceTypeDTO,
  DeviceState,
  CreateDeviceStateDTO,
  UpdateDeviceStateDTO,
  ConnectedDeviceDTO,
  AddConnectedDeviceDTO,
  CreateConnectedDeviceDTO,
} from '../../application/types/devices/device';

export type { IDeviceTypesRepository } from '../repositories/IDeviceTypesRepository';
export type { MainStatsDTO } from '../../application/types/devices/stats';
export type { MicrocontrollerDTO } from '../../application/types/devices/microcontroller_device';
export type { DeviceOwnership, TransferOwnershipDTO } from '../../application/types/devices/ownership';
export type { SolarDeviceWithType, SolarDeviceDetailDTO } from '../../application/types/devices/solar_device';




