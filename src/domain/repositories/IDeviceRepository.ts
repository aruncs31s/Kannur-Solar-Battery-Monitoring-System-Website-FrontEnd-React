import { CreateDeviceDTO, CreateSolarDeviceDTO, DeviceResponseDTO, DeviceSearchResultDTO, UpdateDeviceDTO, DeviceTypeDTO, MicrocontrollerDTO, CreateSensorDeviceDTO, SolarDeviceView, DeviceStateHistoryResponse, DeviceStateHistoryFilters, CreateDeviceTypeDTO, DeviceState, CreateDeviceStateDTO, UpdateDeviceStateDTO, ConnectedDeviceDTO, CreateConnectedDeviceDTO, MainStatsDTO, DeviceOwnership, TransferOwnershipDTO } from '../entities/Device';
import { DeviceTokenResponse, MicrocontrollerStats } from '../../api/devices';
import { ProgressiveReadingsResponse } from '../entities/Reading';

export interface IDeviceRepository {
  /**
   * Retrieves a list of all base devices (microcontrollers) in the system.
   * @returns A promise resolving to an array of device response objects.
   */
  getAll(): Promise<DeviceResponseDTO[]>;

  /**
   * Retrieves a list of all solar energy devices in the system.
   * @returns A promise resolving to an array of device response objects.
   */
  getAllSolarDevices(): Promise<DeviceResponseDTO[]>;

  /**
   * Retrieves main system statistics including total readings, users, and device counts.
   * @returns A promise resolving to system statistics.
   */
  getMainStats(): Promise<MainStatsDTO>;

  /**
   * Retrieves devices specifically owned by or assigned to the current authenticated user.
   * @returns A promise resolving to an array of device response objects.
   */
  getMyDevices(): Promise<DeviceResponseDTO[]>;

  /**
   * Creates a new base device (microcontroller) in the system.
   * @param device The data required to create the device.
   * @returns A promise resolving to the created device object.
   */
  create(device: CreateDeviceDTO): Promise<DeviceResponseDTO>;

  /**
   * Creates a new solar monitoring device.
   * @param device The data required to create the solar device.
   * @returns A promise resolving to the created solar device object.
   */
  createSolarDevice(device: CreateSolarDeviceDTO): Promise<DeviceResponseDTO>;

  /**
   * Searches for devices across all types based on a search query.
   * @param query The search string (matches name, IP, or MAC).
   * @returns A promise resolving to an array of matching devices.
   */
  search(query: string): Promise<DeviceResponseDTO[]>;

  /**
   * Searches specifically for microcontroller devices.
   * @param query The search string.
   * @returns A promise resolving to an array of matching microcontrollers.
   */
  searchMicrocontrollers(query: string): Promise<DeviceSearchResultDTO[]>;

  /**
   * Lists all microcontrollers available in the system.
   * @returns A promise resolving to an array of microcontroller details.
   */
  getMicrocontrollers(): Promise<MicrocontrollerDTO[]>;

  /**
   * Retrieves aggregate statistics specifically for microcontrollers (uptime, online count, etc.).
   * @returns A promise resolving to microcontroller statistics.
   */
  getMicrocontrollerStats(): Promise<MicrocontrollerStats>;


  /**
   * Lists microcontrollers that are specifically owned by or assigned to the current authenticated user.
   * @returns A promise resolving to an array of the user's microcontroller details.
   */
  getMyMicrocontrollers(): Promise<MicrocontrollerDTO[]>;

  /**
   * Generates a new unique access token for a device to authenticate with the backend.
   * @param deviceId The ID of the device to generate a token for.
   * @returns A promise resolving to the token response containing the JWT and metadata.
   */
  generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse>;

  /**
   * Retrieves the specific type information for a device.
   * @param deviceId The ID of the device.
   * @returns A promise resolving to the device type details.
   */
  getDeviceType(deviceId: number): Promise<DeviceTypeDTO>;

  /**
   * Updates partial metadata for an existing device.
   * @param deviceId The ID of the device to update.
   * @param data The partial data for the update.
   * @returns A promise resolving to the updated device object.
   */
  updateDevice(deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO>;

  /**
   * Permanently deletes a device from the system.
   * @param deviceId The ID of the device to delete.
   * @returns A promise that resolves when the device is successfully deleted.
   */
  deleteDevice(deviceId: number): Promise<void>;

  /**
   * Sends a control command/action to a device (e.g., reboot, toggle relay).
   * @param deviceId The ID of the device receiving the action.
   * @param action The numeric action ID.
   * @returns A promise resolving to a success message.
   */
  controlDevice(deviceId: number, action: number): Promise<{ success: boolean; message: string }>;

  /**
   * Retrieves all child devices (sensors) currently connected to a parent controller.
   * @param deviceId The ID of the parent device.
   * @returns A promise resolving to an array of connected devices.
   */
  getConnectedDevices(deviceId: number): Promise<ConnectedDeviceDTO[]>;

  /**
   * Connects an existing device as a child to another device.
   * @param deviceId The ID of the parent device.
   * @param childId The ID of the existing device to connect as a child.
   * @returns A promise resolving to a success message.
   */
  addConnectedDevice(deviceId: number, childId: number): Promise<{ message: string }>;

  /**
   * Creates a new device and immediately connects it as a child to a parent device.
   * @param deviceId The ID of the parent device.
   * @param data The data for the new child device.
   * @returns A promise resolving to a success message.
   */
  createAndConnectDevice(deviceId: number, data: CreateConnectedDeviceDTO): Promise<{ message: string }>;

  /**
   * Retrieves the ownership and privacy status for a specific device.
   * @param deviceId The ID of the device.
   * @returns A promise resolving to the ownership details.
   */
  getOwnership(deviceId: number): Promise<DeviceOwnership>;

  /**
   * Transfers full ownership of a device to another user.
   * @param deviceId The ID of the device to transfer.
   * @param data The transfer details including the target user ID and optional note.
   * @returns A promise that resolves when the transfer is successful.
   */
  transferOwnership(deviceId: number, data: TransferOwnershipDTO): Promise<void>;

  /**
   * Sets whether a device is publicly visible to all authenticated users or private to the owner.
   * @param deviceId The ID of the device.
   * @param isPublic True to make it public, false to for private.
   * @returns A promise that resolves when the visibility is updated.
   */
  setVisibility(deviceId: number, isPublic: boolean): Promise<void>;

  /**
   * Dissociates a child device from its parent controller.
   * @param deviceId The ID of the parent device.
   * @param connectedDeviceId The ID of the connected child device.
   * @returns A promise resolving to a success message.
   */
  removeConnectedDevice(deviceId: number, connectedDeviceId: number): Promise<{ success: boolean; message: string }>;

  /**
   * Retrieves a list of recently added or active devices.
   * @returns A promise resolving to an array of device response objects.
   */
  getRecentDevices(): Promise<DeviceResponseDTO[]>;

  /**
   * Retrieves a list of devices that are currently considered offline or inactive.
   * @returns A promise resolving to an array of device response objects.
   */
  getOfflineDevices(): Promise<DeviceResponseDTO[]>;

  /**
   * Retrieves a specialized set of readings optimized for real-time charting and historical progression.
   * @param deviceId The ID of the device.
   * @returns A promise resolving to progressive reading data.
   */
  getProgressiveReadings(deviceId: number): Promise<ProgressiveReadingsResponse>;

  /**
   * Defines a new device type (template) in the system.
   * @param data The data for the new device type.
   * @returns A promise resolving to a success message.
   */
  createDeviceType(data: CreateDeviceTypeDTO): Promise<{ message: string }>;

  /**
   * Creates a new independent sensor device.
   * @param data The data for the sensor device.
   * @returns A promise resolving to the created sensor device object.
   */
  createSensorDevice(data: CreateSensorDeviceDTO): Promise<DeviceResponseDTO>;

  /**
   * Retrieves all solar devices owned by the current authenticated user.
   * @returns A promise resolving to an array of solar device view objects.
   */
  getMySolarDevices(): Promise<SolarDeviceView[]>;

  /**
   * Retrieves full details for a single device.
   * @param deviceId The ID of the device.
   * @returns A promise resolving to the device detail object.
   */
  getDevice(deviceId: string | number): Promise<{ device: any }>;

  /**
   * Uploads a pre-compiled firmware binary to be associated with a device for OTA updates.
   * @param deviceId The ID of the device.
   * @param firmwareFile The binary file to upload.
   * @returns A promise resolving to a success message.
   */
  uploadFirmware(deviceId: number, firmwareFile: File): Promise<{ message: string }>;

  /**
   * Triggers a remote firmware build process for a device configuration.
   * @param config The build configuration details.
   * @returns A promise resolving to build registration data.
   */
  buildFirmware(config: any): Promise<any>;

  /**
   * Checks the current status of a firmware build process.
   * @param buildId The unique ID of the build process.
   * @returns A promise resolving to the build status information.
   */
  getFirmwareBuildStatus(buildId: string): Promise<any>;

  /**
   * Downloads a completed firmware binary.
   * @param buildId The unique ID of the completed build.
   * @returns A promise resolving to the binary Blob data.
   */
  downloadFirmware(buildId: string): Promise<Blob>;

  /**
   * Retrieves a historical log of when the device changed its operational state (online, offline, etc.).
   * @param deviceId The ID of the device.
   * @param filters Optional date or state filters for history.
   * @returns A promise resolving to the state change history logs.
   */
  getDeviceStateHistory(deviceId: string | number, filters?: DeviceStateHistoryFilters): Promise<DeviceStateHistoryResponse>;

  /**
   * Retrieves all available operational states defined in the system.
   * @returns A promise resolving to an array of device states.
   */
  getDeviceStates(): Promise<DeviceState[]>;

  /**
   * Retrieves details for a specific operational state ID.
   * @param id The numeric ID of the state.
   * @returns A promise resolving to the state details.
   */
  getDeviceState(id: number): Promise<DeviceState>;

  /**
   * Defines a new operational state in the system.
   * @param data The data for the new state.
   * @returns A promise resolving to the created state.
   */
  createDeviceState(data: CreateDeviceStateDTO): Promise<DeviceState>;

  /**
   * Updates an existing operational state definition.
   * @param id The numeric ID of the state to update.
   * @param data The updated state data.
   * @returns A promise resolving to the updated state.
   */
  updateDeviceState(id: number, data: UpdateDeviceStateDTO): Promise<DeviceState>;

  /**
   * Retrieves all solar devices located within a specific geographic location.
   * @param locationId The numeric ID of the location.
   * @returns A promise resolving to an array of solar devices in that location.
   */
  getDevicesByLocation(locationId: number): Promise<SolarDeviceView[]>;
}
