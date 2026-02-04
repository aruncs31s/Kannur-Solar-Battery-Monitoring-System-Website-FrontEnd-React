
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

export interface CreateDeviceDTO {
  name: string;
  uid: string;
  type: number;
  ip_address: string;
  mac_address: string;
  firmware_version_id: number;
  address: string;
  city: string;
}

export interface CreateSolarDeviceDTO {
  name: string;
  device_type_id: string;
  address: string;
  city: string;
  connected_microcontroller_id: number;
}

export interface DeviceSearchResultDTO {
  id: number;
  name: string;
}
