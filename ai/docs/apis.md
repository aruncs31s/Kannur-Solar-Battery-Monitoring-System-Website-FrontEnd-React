# API Documentation

## Overview
This document describes all API modules available in the application. Each API module provides a facade over the underlying use cases and repository implementations.

## Base Configuration

### HTTP Client
- **Base URL**: `http://localhost:8080/api`
- **Environment Variable**: `VITE_API_URL`
- **Implementation**: Axios-based with interceptors
- **Location**: `src/infrastructure/http/HttpClient.ts`

### Proxy Configuration (Development)
```typescript
// vite.config.ts
'/api': {
  target: 'http://localhost:8080',
  changeOrigin: true,
  secure: false,
}
```

---

## 1. Authentication API (`src/api/auth.ts`)

Handles user authentication and authorization.

### Methods

#### `login(credentials: UserCredentials): Promise<string>`
Authenticates user and returns JWT token.

**Parameters:**
- `credentials.username`: string
- `credentials.password`: string

**Returns:** JWT token string

**Example:**
```typescript
import { authAPI } from './api/auth';

const token = await authAPI.login({
  username: 'user@example.com',
  password: 'password123'
});
```

#### `register(username, password, email?, name?): Promise<{ token: string; user: User }>`
Registers a new user.

**Parameters:**
- `username`: string (required)
- `password`: string (required)
- `email`: string (optional)
- `name`: string (optional)

**Returns:** Object with token and user data

#### `logout(): Promise<void>`
Logs out the current user.

#### `validateToken(token: string): Promise<boolean>`
Validates a JWT token.

---

## 2. Devices API (`src/api/devices.ts`)

Manages devices, microcontrollers, and firmware.

### Device Management

#### `getAllDevices(): Promise<DeviceResponseDTO[]>`
Retrieves all devices in the system.

#### `getMyDevices(): Promise<DeviceResponseDTO[]>`
Retrieves devices owned by the current user.

#### `getMySolarDevices(): Promise<SolarDeviceView[]>`
Retrieves solar devices owned by the current user.

#### `getDevice(deviceId: string | number): Promise<{ device: any }>`
Retrieves a specific device by ID.

#### `createDevice(data: CreateDeviceDTO): Promise<DeviceResponseDTO>`
Creates a new device.

**Example:**
```typescript
const device = await devicesAPI.createDevice({
  name: 'Solar Panel 1',
  device_type_id: 1,
  location_id: 5
});
```

#### `createSolarDevice(data: CreateSolarDeviceDTO): Promise<DeviceResponseDTO>`
Creates a new solar device with specific solar parameters.

#### `createSensorDevice(data: CreateSensorDeviceDTO): Promise<DeviceResponseDTO>`
Creates a new sensor device.

#### `updateDevice(deviceId: number, data: UpdateDeviceDTO): Promise<DeviceResponseDTO>`
Updates an existing device.

#### `searchDevices(query: string): Promise<DeviceResponseDTO[]>`
Searches devices by name or other attributes.

#### `searchMicrocontrollers(query: string): Promise<DeviceSearchResultDTO[]>`
Searches microcontrollers.

### Device Types

#### `getDeviceTypes(): Promise<DeviceTypeDTO[]>`
Retrieves all device types.

#### `getDeviceType(deviceId: number): Promise<DeviceTypeDTO>`
Retrieves a specific device type.

#### `createDeviceType(data: CreateDeviceTypeDTO): Promise<{ message: string }>`
Creates a new device type.

#### `getHardwareDeviceTypes(): Promise<{ device_type: DeviceTypeDTO[] }>`
Retrieves hardware-specific device types.

### Microcontroller Management

#### `getMicrocontrollers(): Promise<MicrocontrollerDTO[]>`
Retrieves all microcontrollers.

#### `getMicrocontrollerStats(): Promise<MicrocontrollerStats>`
Retrieves microcontroller statistics.

**Returns:**
```typescript
{
  total_microcontrollers: number;
  online_microcontrollers: number;
  offline_microcontrollers: number;
  latest_version: string;
}
```

### Device Control

#### `controlDevice(deviceId: number, action: number): Promise<{ success: boolean; message: string }>`
Sends control command to a device.

**Parameters:**
- `deviceId`: Device ID
- `action`: Control action code

#### `generateDeviceToken(deviceId: number): Promise<DeviceTokenResponse>`
Generates authentication token for a device.

**Returns:**
```typescript
{
  token: string;
  user_id: number;
  device_id: number;
}
```

### Device State

#### `getDeviceStates(): Promise<DeviceState[]>`
Retrieves all device states.

#### `getDeviceState(id: number): Promise<DeviceState>`
Retrieves a specific device state.

#### `createDeviceState(data: CreateDeviceStateDTO): Promise<DeviceState>`
Creates a new device state.

#### `updateDeviceState(id: number, data: UpdateDeviceStateDTO): Promise<DeviceState>`
Updates a device state.

#### `getDeviceStateHistory(deviceId: string | number, filters?: DeviceStateHistoryFilters): Promise<DeviceStateHistoryResponse>`
Retrieves device state history with optional filters.

### Firmware Management

#### `uploadFirmware(deviceId: number, firmwareFile: File): Promise<{ message: string }>`
Uploads firmware to a device (OTA update).

**Example:**
```typescript
const file = event.target.files[0];
await devicesAPI.uploadFirmware(deviceId, file);
```

#### `buildFirmware(config: FirmwareBuildConfig): Promise<FirmwareBuildResponse>`
Initiates firmware build process.

**Parameters:**
```typescript
{
  device_id: number;
  device_name: string;
  ip: string;
  host_ip: string;
  host_ssid: string;
  host_pass: string;
  port: number;
  token?: string;
  build_tool?: 'platformio' | 'arduino';
}
```

**Returns:**
```typescript
{
  build_id: string;
  message: string;
  status: 'queued' | 'building' | 'completed' | 'failed';
}
```

#### `getFirmwareBuildStatus(buildId: string): Promise<FirmwareBuildStatus>`
Checks firmware build status.

**Returns:**
```typescript
{
  build_id: string;
  status: 'queued' | 'building' | 'completed' | 'failed';
  progress: number;
  message: string;
  download_url?: string;
}
```

#### `downloadFirmware(buildId: string): Promise<Blob>`
Downloads compiled firmware binary.

### Connected Devices

#### `getConnectedDevices(deviceId: number): Promise<ConnectedDeviceDTO[]>`
Retrieves devices connected to a parent device.

#### `addConnectedDevice(deviceId: number, childId: number): Promise<{ message: string }>`
Connects an existing device to a parent device.

#### `createAndConnectDevice(deviceId: number, data: CreateConnectedDeviceDTO): Promise<{ message: string }>`
Creates a new device and connects it to a parent.

---

## 3. Locations API (`src/api/locations.ts`)

Manages geographic locations for devices.

### Methods

#### `getAllLocations(): Promise<LocationResponseDTO[]>`
Retrieves all locations.

#### `getLocation(id: number): Promise<LocationResponseDTO>`
Retrieves a specific location.

#### `searchLocations(query: string): Promise<LocationResponseDTO[]>`
Searches locations by name or address.

#### `createLocation(location: CreateLocationDTO): Promise<{ message: string }>`
Creates a new location.

**Example:**
```typescript
await locationsAPI.createLocation({
  name: 'Solar Farm A',
  address: '123 Main St',
  latitude: 12.345,
  longitude: 67.890
});
```

#### `updateLocation(id: number, location: UpdateLocationDTO): Promise<{ message: string }>`
Updates an existing location.

#### `deleteLocation(id: number): Promise<{ message: string }>`
Deletes a location.

#### `getLocationDevices(id: number): Promise<LocationDeviceDTO[]>`
Retrieves all devices at a location.

---

## 4. Readings API (`src/api/readings.ts`)

Manages sensor readings and telemetry data.

### Methods

#### `getByDevice(deviceId: string | number, limit?: number): Promise<Reading[]>`
Retrieves readings for a specific device.

**Parameters:**
- `deviceId`: Device ID
- `limit`: Optional limit on number of readings

#### `getProgressiveByDevice(deviceId: number): Promise<Reading[]>`
Retrieves progressive/cumulative readings for a device.

#### `getByDateRange(filters: ReadingFilters): Promise<Reading[]>`
Retrieves readings within a date range.

**Filters:**
```typescript
{
  deviceId?: number;
  startDate?: Date;
  endDate?: Date;
  type?: string;
}
```

#### `getSevenDaysByLocation(locationId: number): Promise<Reading[]>`
Retrieves last 7 days of readings for a location.

**Example:**
```typescript
const readings = await readingsAPI.getSevenDaysByLocation(locationId);
// Use for charts and analytics
```

---

## 5. Users API (`src/api/users.ts`)

Manages user accounts and profiles.

### Methods

#### `getById(id: number): Promise<User>`
Retrieves a user by ID.

#### `getCurrentUser(): Promise<User>`
Retrieves the currently authenticated user.

#### `getAll(): Promise<User[]>`
Retrieves all users (admin only).

#### `create(data: Omit<CreateUserDTO, 'id'>): Promise<User>`
Creates a new user.

**Note:** ID is generated by the backend.

#### `update(id: number, data: Partial<User>): Promise<User>`
Updates a user's information.

**Example:**
```typescript
await usersAPI.update(userId, {
  name: 'New Name',
  email: 'newemail@example.com'
});
```

#### `delete(id: number): Promise<void>`
Deletes a user.

---

## 6. Audit Logs API (`src/api/audit.ts`)

Tracks system changes and user actions.

### Methods

#### `getAll(): Promise<AuditLog[]>`
Retrieves all audit logs.

**Example:**
```typescript
const logs = await auditAPI.getAll();
// Display in audit log table
```

---

## 7. Versions API (`src/api/versions.ts`)

Manages application and firmware version information.

### Methods

#### `getAll(): Promise<Version[]>`
Retrieves version information for all components.

---

## Error Handling

All API methods may throw errors that should be handled appropriately:

```typescript
try {
  const devices = await devicesAPI.getAllDevices();
} catch (error) {
  if (axios.isAxiosError(error)) {
    // Handle HTTP errors
    console.error('API Error:', error.response?.data);
  } else {
    // Handle other errors
    console.error('Error:', error);
  }
}
```

## Authentication

Most API endpoints require authentication. The HTTP client automatically includes the JWT token from localStorage in request headers:

```typescript
Authorization: Bearer <token>
```

Protected routes redirect to `/login` if the token is missing or invalid.

## Usage in Components

### Recommended Pattern

```typescript
import { devicesAPI } from '../api/devices';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await devicesAPI.getAllDevices();
        setDevices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  
  return <div>{/* Render devices */}</div>;
}
```

## Best Practices

1. **Always handle loading and error states**
2. **Use try-catch blocks** for async operations
3. **Cleanup async operations** in useEffect cleanup functions
4. **Cache data when appropriate** using state management (Zustand)
5. **Avoid multiple simultaneous requests** for the same data
6. **Use TypeScript types** for better autocomplete and type safety
7. **Handle 401 errors** by redirecting to login
8. **Provide user feedback** for long-running operations
