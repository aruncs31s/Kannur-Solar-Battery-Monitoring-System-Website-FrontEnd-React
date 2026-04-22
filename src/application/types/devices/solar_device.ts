import { DeviceStatus } from "../../../domain/entities/Device";
import { ConnectedDeviceDTO, DeviceResponseDTO } from "./device";

/**
 * Aggregated view of a solar device including real-time reading data.
 */
export interface SolarDeviceWithType {
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
 * Full hierarchal view of a Solar device, including connected controllers and their sensor arrays.
 */
export interface SolarDeviceDetailDTO extends DeviceResponseDTO {
  device_type_name?: string;
  /** List of microcontrollers facilitating this solar device */
  connected_microcontrollers: ConnectedDeviceDTO[];
}

