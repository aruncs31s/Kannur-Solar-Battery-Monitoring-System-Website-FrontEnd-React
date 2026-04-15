
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