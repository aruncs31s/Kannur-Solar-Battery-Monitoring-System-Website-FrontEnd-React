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
