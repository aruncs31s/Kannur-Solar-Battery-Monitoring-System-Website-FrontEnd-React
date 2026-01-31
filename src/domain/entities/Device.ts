export interface Device {
  id: number;
  name: string;
  mac: string;
  installedLocation: string;
  status: DeviceStatus;
  installedBy: string;
  createdAt: number;
  updatedAt: number;
  latitude?: number;
  longitude?: number;
}

export type DeviceStatus = "active" | "inactive" | "error" | "maintenance" | "decommissioned" | "unknown";

export interface CreateDeviceDTO {
  name: string;
  mac: string;
  installedLocation: string;
  status: DeviceStatus;
  installedBy: string;
  latitude?: number;
  longitude?: number;
}
