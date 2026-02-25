# API Documentation

This document describes all available APIs in the application. All APIs are located in `src/api/` and serve as a facade to the underlying use cases and repositories.

## Authentication API (`src/api/auth.ts`)

Handles user authentication and session management.

### Methods

#### `authAPI.login(credentials: UserCredentials): Promise<string>`
- **Description**: Authenticates a user and returns a JWT token
- **Parameters**:
  - `credentials.username`: string
  - `credentials.password`: string
- **Returns**: JWT token string
- **Example**:
```typescript
const token = await authAPI.login({ username: 'user', password: 'pass' });
```

#### `authAPI.register(username, password, email?, name?): Promise<{token: string, user: User}>`
- **Description**: Registers a new user account
- **Parameters**:
  - `username`: string (required)
  - `password`: string (required)
  - `email`: string (optional)
  - `name`: string (optional)
- **Returns**: Object with token and user data

#### `authAPI.logout(): Promise<void>`
- **Description**: Logs out the current user and clears session
- **Returns**: void

#### `authAPI.validateToken(token: string): Promise<boolean>`
- **Description**: Validates if a JWT token is still valid
- **Parameters**:
  - `token`: JWT token string
- **Returns**: boolean indicating validity

---

## Devices API (`src/api/devices.ts`)

Manages all device-related operations including solar devices, sensors, and microcontrollers.

### Device CRUD Operations

#### `devicesAPI.getAllDevices(): Promise<DeviceResponseDTO[]>`
- **Description**: Retrieves all devices in the system
- **Returns**: Array of device objects

#### `devicesAPI.getMyDevices(): Promise<DeviceResponseDTO[]>`
- **Description**: Retrieves devices owned by the current user
- **Returns**: Array of user's devices

#### `devicesAPI.getMySolarDevices(): Promise<SolarDeviceView[]>`
- **Description**: Retrieves solar devices owned by the current user
- **Returns**: Array of solar device views

#### `devicesAPI.getDevice(deviceId: string | number): Promise<{device: any}>`
- **Description**: Retrieves details for a specific device
- **Parameters**:
  - `deviceId`: Device ID (string or number)
- **Returns**: Device object

#### `devicesAPI.createDevice(data: CreateDeviceDTO): Promise<DeviceResponseDTO>`
- **Description**: Creates a new device
- **Parameters**:
  - `data`: Device creation data
- **Returns**: Created device object

#### `devicesAPI.createSolarDevice(data: CreateSolarDeviceDTO): Promise<DeviceResponseDTO>`
- **Description**: Creates a new solar device
- **Parameters**:
  - `data`: Solar device creation data
- **Returns**: Created solar device object

#### `devicesAPI.createSensorDevice(data: CreateSensorDeviceDTO): Promise<DeviceResponseDTO>`
- **Description**: Creates a new sensor device
- **Parameters**:
  - `data`: Sensor device creation data
- **Returns**: Created sensor device object

#### `devicesAPI.updateDevice(deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO>`
- **Description**: Updates an existing device
- **Parameters**:
  - `deviceId`: Device ID
  - `data`: Update data
- **Returns**: Updated device object

### Device Search

#### `devicesAPI.searchDevices(query: string): Promise<DeviceResponseDTO[]>`
- **Description**: Searches for devices by query string
- **Parameters**:
  - `query`: Search query
- **Returns**: Array of matching devices

#### `devicesAPI.searchMicrocontrollers(query: string): Promise<DeviceSearchResultDTO[]>`
- **Description**: Searches for microcontrollers by query string
- **Parameters**:
  - `query`: Search query
- **Returns**: Array of matching microcontrollers

### Device Types

#### `devicesAPI.getDeviceTypes(): Promise<DeviceTypeDTO[]>`
- **Description**: Retrieves all device types
- **Returns**: Array of device types

#### `devicesAPI.getDeviceType(deviceId: number): Promise<DeviceTypeDTO>`
- **Description**: Retrieves a specific device type
- **Parameters**:
  - `deviceId`: Device type ID
- **Returns**: Device type object

#### `devicesAPI.createDeviceType(data: CreateDeviceTypeDTO): Promise<{message: string}>`
- **Description**: Creates a new device type
- **Parameters**:
  - `data`: Device type creation data
- **Returns**: Success message

#### `devicesAPI.getHardwareDeviceTypes(): Promise<{device_type: DeviceTypeDTO[]}>`
- **Description**: Retrieves hardware-specific device types
- **Returns**: Object containing array of hardware device types

### Microcontroller Management

#### `devicesAPI.getMicrocontrollers(): Promise<MicrocontrollerDTO[]>`
- **Description**: Retrieves all microcontrollers
- **Returns**: Array of microcontroller objects

#### `devicesAPI.getMicrocontrollerStats(): Promise<MicrocontrollerStats>`
- **Description**: Retrieves statistics about microcontrollers
- **Returns**: Object with stats:
  - `total_microcontrollers`: number
  - `online_microcontrollers`: number
  - `offline_microcontrollers`: number
  - `latest_version`: string

### Device Control

#### `devicesAPI.controlDevice(deviceId: number, action: number): Promise<{success: boolean, message: string}>`
- **Description**: Sends a control command to a device
- **Parameters**:
  - `deviceId`: Device ID
  - `action`: Action code (number)
- **Returns**: Success status and message

#### `devicesAPI.generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse>`
- **Description**: Generates an authentication token for a device
- **Parameters**:
  - `deviceId`: Device ID
- **Returns**: Token response with user_id and device_id

### Firmware Management

#### `devicesAPI.uploadFirmware(deviceId: number, firmwareFile: File): Promise<{message: string}>`
- **Description**: Uploads firmware file to a device
- **Parameters**:
  - `deviceId`: Device ID
  - `firmwareFile`: Firmware binary file
- **Returns**: Success message

#### `devicesAPI.buildFirmware(config: FirmwareBuildConfig): Promise<FirmwareBuildResponse>`
- **Description**: Initiates an online firmware build
- **Parameters**:
  - `config`: Build configuration
    - `device_id`: number
    - `device_name`: string
    - `ip`: string
    - `host_ip`: string
    - `host_ssid`: string
    - `host_pass`: string
    - `port`: number
    - `token`: string (optional)
    - `build_tool`: 'platformio' | 'arduino' (optional)
- **Returns**: Build response with build_id and status

#### `devicesAPI.getFirmwareBuildStatus(buildId: string): Promise<FirmwareBuildStatus>`
- **Description**: Checks the status of a firmware build
- **Parameters**:
  - `buildId`: Build identifier
- **Returns**: Build status object with progress and download_url

#### `devicesAPI.downloadFirmware(buildId: string): Promise<Blob>`
- **Description**: Downloads a completed firmware build
- **Parameters**:
  - `buildId`: Build identifier
- **Returns**: Firmware binary blob

### Device State Management

#### `devicesAPI.getDeviceStateHistory(deviceId: string | number, filters?: DeviceStateHistoryFilters): Promise<DeviceStateHistoryResponse>`
- **Description**: Retrieves state change history for a device
- **Parameters**:
  - `deviceId`: Device ID
  - `filters`: Optional filters (date range, etc.)
- **Returns**: State history data

#### `devicesAPI.getDeviceStates(): Promise<DeviceState[]>`
- **Description**: Retrieves all possible device states
- **Returns**: Array of device states

#### `devicesAPI.getDeviceState(id: number): Promise<DeviceState>`
- **Description**: Retrieves a specific device state definition
- **Parameters**:
  - `id`: State ID
- **Returns**: Device state object

#### `devicesAPI.createDeviceState(data: CreateDeviceStateDTO): Promise<DeviceState>`
- **Description**: Creates a new device state definition
- **Parameters**:
  - `data`: State creation data
- **Returns**: Created state object

#### `devicesAPI.updateDeviceState(id: number, data: UpdateDeviceStateDTO): Promise<DeviceState>`
- **Description**: Updates a device state definition
- **Parameters**:
  - `id`: State ID
  - `data`: Update data
- **Returns**: Updated state object

### Connected Devices

#### `devicesAPI.getConnectedDevices(deviceId: number): Promise<ConnectedDeviceDTO[]>`
- **Description**: Retrieves devices connected to a parent device
- **Parameters**:
  - `deviceId`: Parent device ID
- **Returns**: Array of connected devices

#### `devicesAPI.addConnectedDevice(deviceId: number, childId: number): Promise<{message: string}>`
- **Description**: Connects an existing device to a parent device
- **Parameters**:
  - `deviceId`: Parent device ID
  - `childId`: Child device ID
- **Returns**: Success message

#### `devicesAPI.createAndConnectDevice(deviceId: number, data: CreateConnectedDeviceDTO): Promise<{message: string}>`
- **Description**: Creates a new device and connects it to a parent
- **Parameters**:
  - `deviceId`: Parent device ID
  - `data`: New device data
- **Returns**: Success message

---

## Readings API (`src/api/readings.ts`)

Manages device sensor readings and telemetry data.

#### `readingsAPI.getByDevice(deviceId: string | number, limit?: number): Promise<Reading[]>`
- **Description**: Retrieves readings for a specific device
- **Parameters**:
  - `deviceId`: Device ID
  - `limit`: Optional limit on number of readings
- **Returns**: Array of reading objects

#### `readingsAPI.getProgressiveByDevice(deviceId: number): Promise<Reading[]>`
- **Description**: Retrieves progressive (incremental) readings for a device
- **Parameters**:
  - `deviceId`: Device ID
- **Returns**: Array of reading objects

#### `readingsAPI.getByDateRange(filters: ReadingFilters): Promise<Reading[]>`
- **Description**: Retrieves readings filtered by date range
- **Parameters**:
  - `filters`: Filter object with date range and device criteria
- **Returns**: Array of reading objects

#### `readingsAPI.getSevenDaysByLocation(locationId: number): Promise<Reading[]>`
- **Description**: Retrieves last 7 days of readings for a location
- **Parameters**:
  - `locationId`: Location ID
- **Returns**: Array of reading objects

---

## Locations API (`src/api/locations.ts`)

Manages geographical locations where devices are deployed.

#### `locationsAPI.getAllLocations(): Promise<LocationResponseDTO[]>`
- **Description**: Retrieves all locations in the system
- **Returns**: Array of location objects

#### `locationsAPI.getLocation(id: number): Promise<LocationResponseDTO>`
- **Description**: Retrieves a specific location
- **Parameters**:
  - `id`: Location ID
- **Returns**: Location object

#### `locationsAPI.searchLocations(query: string): Promise<LocationResponseDTO[]>`
- **Description**: Searches for locations by query string
- **Parameters**:
  - `query`: Search query
- **Returns**: Array of matching locations

#### `locationsAPI.createLocation(location: CreateLocationDTO): Promise<{message: string}>`
- **Description**: Creates a new location
- **Parameters**:
  - `location`: Location creation data
- **Returns**: Success message

#### `locationsAPI.updateLocation(id: number, location: UpdateLocationDTO): Promise<{message: string}>`
- **Description**: Updates an existing location
- **Parameters**:
  - `id`: Location ID
  - `location`: Update data
- **Returns**: Success message

#### `locationsAPI.deleteLocation(id: number): Promise<{message: string}>`
- **Description**: Deletes a location
- **Parameters**:
  - `id`: Location ID
- **Returns**: Success message

#### `locationsAPI.getDevicesByLocation(locationId: number): Promise<LocationDeviceDTO[]>`
- **Description**: Retrieves all devices at a specific location
- **Parameters**:
  - `locationId`: Location ID
- **Returns**: Array of device objects at the location

---

## Users API (`src/api/users.ts`)

Manages user accounts and profiles.

#### `usersAPI.getById(id: number): Promise<User>`
- **Description**: Retrieves a user by ID
- **Parameters**:
  - `id`: User ID
- **Returns**: User object

#### `usersAPI.getCurrentUser(): Promise<User>`
- **Description**: Retrieves the currently authenticated user
- **Returns**: Current user object

#### `usersAPI.getAll(): Promise<User[]>`
- **Description**: Retrieves all users (admin only)
- **Returns**: Array of user objects

#### `usersAPI.create(data: Omit<CreateUserDTO, 'id'>): Promise<User>`
- **Description**: Creates a new user (admin only)
- **Parameters**:
  - `data`: User creation data (ID is auto-generated)
- **Returns**: Created user object

#### `usersAPI.update(id: number, data: Partial<User>): Promise<User>`
- **Description**: Updates a user's information
- **Parameters**:
  - `id`: User ID
  - `data`: Partial user data to update
- **Returns**: Updated user object

#### `usersAPI.delete(id: number): Promise<void>`
- **Description**: Deletes a user account (admin only)
- **Parameters**:
  - `id`: User ID
- **Returns**: void

---

## Versions API (`src/api/versions.ts`)

Manages application versions and their features.

#### `versionsAPI.getById(id: string): Promise<Version>`
- **Description**: Retrieves a specific version
- **Parameters**:
  - `id`: Version ID
- **Returns**: Version object

#### `versionsAPI.getAll(): Promise<Version[]>`
- **Description**: Retrieves all versions
- **Returns**: Array of version objects

#### `versionsAPI.create(data: CreateVersionDTO): Promise<Version>`
- **Description**: Creates a new version
- **Parameters**:
  - `data`: Version creation data
- **Returns**: Created version object

#### `versionsAPI.update(id: string, data: UpdateVersionDTO): Promise<Version>`
- **Description**: Updates a version
- **Parameters**:
  - `id`: Version ID
  - `data`: Update data
- **Returns**: Updated version object

#### `versionsAPI.delete(id: string): Promise<void>`
- **Description**: Deletes a version
- **Parameters**:
  - `id`: Version ID
- **Returns**: void

### Features Management

#### `versionsAPI.createFeature(data: CreateFeatureDTO): Promise<Feature>`
- **Description**: Creates a new feature for a version
- **Parameters**:
  - `data`: Feature creation data
- **Returns**: Created feature object

#### `versionsAPI.getFeaturesByVersion(versionId: string): Promise<Feature[]>`
- **Description**: Retrieves all features for a specific version
- **Parameters**:
  - `versionId`: Version ID
- **Returns**: Array of feature objects

#### `versionsAPI.updateFeature(id: string, data: UpdateFeatureDTO): Promise<Feature>`
- **Description**: Updates a feature
- **Parameters**:
  - `id`: Feature ID
  - `data`: Update data
- **Returns**: Updated feature object

#### `versionsAPI.deleteFeature(id: string): Promise<void>`
- **Description**: Deletes a feature
- **Parameters**:
  - `id`: Feature ID
- **Returns**: void

---

## Audit API (`src/api/audit.ts`)

Manages audit logs for tracking system activities.

#### `auditAPI.getAll(): Promise<AuditLog[]>`
- **Description**: Retrieves all audit logs
- **Returns**: Array of audit log entries

---

## Error Handling

All API calls may throw errors. It's recommended to wrap API calls in try-catch blocks:

```typescript
try {
  const devices = await devicesAPI.getAllDevices();
  // Process devices
} catch (error) {
  console.error('Failed to fetch devices:', error);
  // Handle error appropriately
}
```

## Type Definitions

All TypeScript interfaces and types used in these APIs are defined in:
- `src/domain/entities/Device.ts`
- `src/domain/entities/User.ts`
- `src/domain/entities/Location.ts`
- `src/domain/entities/Reading.ts`
- `src/domain/entities/Version.ts`
- `src/domain/entities/AuditLog.ts`
