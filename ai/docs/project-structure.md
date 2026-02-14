# Project Structure

## Overview
This is a React + TypeScript frontend application for a Solar Battery Monitoring System. The project follows Clean Architecture principles with a clear separation of concerns.

## Directory Structure

```
src/
├── api/                    # API layer - Interface to backend services
├── application/            # Application layer
│   ├── di/                # Dependency injection container
│   ├── types/             # Application-specific types
│   └── usecases/          # Business logic use cases
├── components/            # Reusable React components
├── domain/                # Domain layer
│   ├── entities/          # Domain entities/models
│   └── repositories/      # Repository interfaces
├── infrastructure/        # Infrastructure layer
│   ├── http/              # HTTP client implementation
│   └── repositories/      # Repository implementations
├── pages/                 # Page components (routes)
├── store/                 # State management (Zustand)
├── utils/                 # Utility functions
├── App.tsx               # Main application component
├── main.tsx              # Application entry point
└── index.css             # Global styles
```

## Architecture Layers

### 1. Domain Layer (`src/domain/`)
Contains core business entities and repository interfaces. This is the innermost layer with no dependencies on other layers.

**Entities:**
- `Device.ts` - Device-related entities and DTOs
- `Location.ts` - Location entities
- `User.ts` - User entities and authentication types
- `Reading.ts` - Sensor reading entities
- `AuditLog.ts` - Audit log entities
- `Version.ts` - Version information entities

### 2. Application Layer (`src/application/`)
Contains use cases (business logic) and dependency injection setup.

**Key Components:**
- **DI Container** (`di/container.ts`): Manages dependency injection for use cases and repositories
- **Use Cases** (`usecases/`): Implements business logic operations
- **Types** (`types/`): Application-specific type definitions

### 3. Infrastructure Layer (`src/infrastructure/`)
Implements technical capabilities and external integrations.

**Components:**
- **HTTP Client** (`http/HttpClient.ts`): Axios-based HTTP client with interceptors
- **Repositories** (`repositories/`): Concrete implementations of domain repositories

### 4. API Layer (`src/api/`)
Provides a clean interface to backend services. Acts as a facade over use cases.

**API Modules:**
- `auth.ts` - Authentication APIs
- `devices.ts` - Device management APIs
- `locations.ts` - Location management APIs
- `readings.ts` - Sensor readings APIs
- `users.ts` - User management APIs
- `audit.ts` - Audit log APIs
- `versions.ts` - Version information APIs

### 5. Presentation Layer

#### Components (`src/components/`)
Reusable UI components (46 total components). See `components.md` for details.

#### Pages (`src/pages/`)
Route-level components:
- `Dashboard.tsx` - Main dashboard
- `Devices.tsx` - All devices view
- `MyDevices.tsx` - User's devices
- `MyMicrocontrollers.tsx` - User's microcontrollers
- `DeviceDetail.tsx` - Device details
- `Locations.tsx` - Locations list
- `LocationDetails.tsx` - Location details
- `MapView.tsx` - Map visualization
- `Admin*.tsx` - Admin pages
- `Login.tsx` / `Register.tsx` - Authentication pages
- And more...

#### State Management (`src/store/`)
Zustand-based stores:
- `authStore.ts` - Authentication state
- `devicesStore.ts` - Devices state
- `searchStore.ts` - Search functionality state
- `themeStore.ts` - Theme (dark/light mode) state

## Technology Stack

### Core Dependencies
- **React** 18.2.0 - UI library
- **TypeScript** 5.2.2 - Type safety
- **React Router** 6.20.0 - Routing
- **Vite** 7.3.1 - Build tool and dev server
- **Tailwind CSS** 3.3.6 - Styling

### State & Data Management
- **Zustand** 4.4.7 - State management
- **Axios** 1.6.2 - HTTP client

### UI & Visualization
- **Recharts** 2.15.4 - Charts and graphs
- **Lucide React** 0.294.0 - Icons
- **Framer Motion** 12.29.2 - Animations
- **Leaflet** 1.9.4 - Maps
- **React Leaflet** 4.2.1 - React wrapper for Leaflet

## Build Configuration

### Vite Configuration
- **Dev Server**: Port 3000
- **API Proxy**: `/api` → `http://localhost:8080`
- **Hot Module Replacement**: Enabled

### Environment Variables
- `VITE_API_URL` - Backend API URL (defaults to `http://localhost:8080/api`)

## Design Patterns

1. **Clean Architecture**: Separation of concerns across layers
2. **Dependency Injection**: Centralized in `container.ts`
3. **Repository Pattern**: Abstract data access
4. **Use Case Pattern**: Encapsulate business logic
5. **Facade Pattern**: API layer simplifies access to use cases

## Key Features

1. **Authentication & Authorization**: JWT-based auth with protected routes
2. **Device Management**: CRUD operations for devices and microcontrollers
3. **Real-time Monitoring**: Live sensor readings
4. **Location Management**: Geographic organization of devices
5. **Firmware Management**: OTA updates and firmware building
6. **Data Visualization**: Charts, graphs, and maps
7. **Admin Panel**: User and device administration
8. **Audit Logging**: Track system changes
9. **Dark Mode**: Theme switching support
10. **Responsive Design**: Mobile-friendly UI

## Routing Structure

All routes are protected by `ProtectedRoute` component except `/login` and `/register`.

Main routes:
- `/` - Dashboard
- `/devices` - All devices
- `/my-devices` - User's devices
- `/my-microcontrollers` - User's microcontrollers
- `/devices/:id` - Device details
- `/locations` - Locations
- `/locations/:id` - Location details
- `/map` - Map view
- `/admin/*` - Admin pages
- `/profile` - User profile
- `/audit-logs` - Audit logs
- `/versions` - System versions

## Development Workflow

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production (TypeScript + Vite)
npm run preview  # Preview production build
```

### Code Organization Best Practices
1. Components should be small and focused
2. Business logic belongs in use cases, not components
3. Use dependency injection for testability
4. Keep domain entities free from framework dependencies
5. API layer provides a stable interface to components
