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
