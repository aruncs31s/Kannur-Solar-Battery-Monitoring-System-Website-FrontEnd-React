# Project Structure

This document provides a detailed overview of the project's folder structure and file organization.

## Root Directory Structure

```
.
├── ai/                     # AI-related documentation
│   └── docs/              # Documentation files
├── src/                   # Source code
├── .env                   # Environment variables (not in git)
├── .env.example          # Example environment configuration
├── .git/                 # Git repository data
├── .gitignore            # Git ignore rules
├── .vite/                # Vite cache
├── ESP32_OTA_Server.ino  # Arduino firmware for ESP32 OTA updates
├── index.html            # HTML entry point
├── package.json          # NPM dependencies and scripts
├── package-lock.json     # NPM dependency lock file
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── tsconfig.node.json    # TypeScript config for Node.js
└── vite.config.ts        # Vite build configuration
```

## Source Directory (`src/`)

The source code is organized following Clean Architecture principles with clear separation of concerns.

### Overview

```
src/
├── api/                  # API facade layer
├── application/          # Application layer (use cases, DI)
├── components/           # Reusable React components
├── domain/              # Domain layer (entities, interfaces)
├── infrastructure/      # Infrastructure layer (implementations)
├── pages/               # Page-level components (routes)
├── store/               # State management (Zustand)
├── utils/               # Utility functions
├── App.tsx              # Main application component
├── index.css            # Global styles
├── main.tsx             # Application entry point
└── vite-env.d.ts        # Vite environment types
```

### API Layer (`src/api/`)

Provides a clean interface for components to interact with business logic. Acts as a facade to the application layer.

```
api/
├── audit.ts             # Audit logs API
├── auth.ts              # Authentication API
├── devices.ts           # Device management API
├── locations.ts         # Location management API
├── readings.ts          # Sensor readings API
├── users.ts             # User management API
└── versions.ts          # Version management API
```

**Purpose**: Each file exports an API object with methods that components can call. These methods internally use use cases from the application layer.

### Application Layer (`src/application/`)

Contains business logic and orchestration.

```
application/
├── di/                  # Dependency Injection
│   └── container.ts    # DI container configuration
├── types/              # Application-level type definitions
└── usecases/           # Business logic use cases
    ├── auth/           # Authentication use cases
    ├── devices/        # Device management use cases
    ├── locations/      # Location management use cases
    ├── readings/       # Reading retrieval use cases
    └── ...             # Other domain use cases
```

**Key File**: `container.ts` - Sets up dependency injection, providing instances of repositories and use cases.

### Domain Layer (`src/domain/`)

Contains core business entities and repository interfaces. Technology-agnostic.

```
domain/
├── entities/           # Domain entities
│   ├── AuditLog.ts    # Audit log entity and DTOs
│   ├── Device.ts      # Device entities and DTOs
│   ├── Location.ts    # Location entities and DTOs
│   ├── Reading.ts     # Reading entities and DTOs
│   ├── User.ts        # User entities and DTOs
│   └── Version.ts     # Version entities and DTOs
└── repositories/      # Repository interfaces
    ├── AuthRepository.ts
    ├── DeviceRepository.ts
    ├── LocationRepository.ts
    ├── ReadingRepository.ts
    ├── UserRepository.ts
    └── VersionRepository.ts
```

**Purpose**: 
- **entities/**: Define data structures and DTOs (Data Transfer Objects)
- **repositories/**: Define interfaces for data access (implemented in infrastructure layer)

### Infrastructure Layer (`src/infrastructure/`)

Implements repository interfaces and handles external integrations.

```
infrastructure/
├── http/               # HTTP client configuration
│   └── client.ts      # Axios HTTP client setup
└── repositories/      # Repository implementations
    ├── AuthRepositoryImpl.ts
    ├── DeviceRepositoryImpl.ts
    ├── LocationRepositoryImpl.ts
    ├── ReadingRepositoryImpl.ts
    ├── UserRepositoryImpl.ts
    └── VersionRepositoryImpl.ts
```

**Purpose**: Provides concrete implementations of repository interfaces using HTTP/REST APIs.

### Components (`src/components/`)

Reusable React UI components.

```
components/
├── ActionButton.tsx              # Reusable action button
├── AddDeviceForm.tsx            # Form for adding devices
├── AddSensorDeviceModal.tsx     # Modal for adding sensors
├── AddSolarDeviceModal.tsx      # Modal for adding solar devices
├── AdvancedDeviceAddModal.tsx   # Advanced device creation modal
├── AlertsBanner.tsx             # Alerts display banner
├── AllDevicesSection.tsx        # Section showing all devices
├── BackButton.tsx               # Navigation back button
├── Cards.tsx                    # Card components (StatusBadge, StatsCard)
├── Codegen.tsx                  # Code generation utility
├── DailyBreakdownCharts.tsx     # Daily analytics charts
├── DataTable.tsx                # Generic data table
├── DateRangeFilter.tsx          # Date range picker
├── DeviceControlPanel.tsx       # Device control interface
├── DeviceHeader.tsx             # Device detail header
├── DeviceInfoCard.tsx           # Device information card
├── DeviceTokenModal.tsx         # Device token generation modal
├── EmptyState.tsx               # Empty state placeholder
├── FirmwareBuilderModal.tsx     # Online firmware builder modal
├── FirmwareUploadModal.tsx      # Firmware upload modal
├── FormComponents.tsx           # Form input components
├── Layout.tsx                   # Main layout wrapper
├── LiveReadingsSection.tsx      # Live readings display
├── LoadingState.tsx             # Loading indicator
├── LocationDeviceCard.tsx       # Device card for locations
├── ManagementModules.tsx        # Management module cards
├── MicrocontrollerCard.tsx      # Microcontroller card
├── MicrocontrollersSection.tsx  # Microcontrollers section
├── Modal.tsx                    # Generic modal component
├── Navigation.tsx               # Navigation menu
├── OTAFirmwareUpload.tsx        # OTA firmware upload
├── OnlineFirmwareBuilder.tsx    # Online firmware builder
├── PageHeader.tsx               # Page header component
├── PageHeaderWithBack.tsx       # Page header with back button
├── ProtectedRoute.tsx           # Route protection wrapper
├── QuickActions.tsx             # Quick action buttons
├── ReadingsTable.tsx            # Readings data table
├── SearchBar.tsx                # Search input component
├── Section.tsx                  # Content section wrapper
├── SolarDeviceCard.tsx          # Solar device card
├── SolarDevicesSection.tsx      # Solar devices section
├── StatsGrid.tsx                # Statistics grid layout
├── SystemHealth.tsx             # System health indicator
├── Tabs.tsx                     # Tab navigation component
├── UpdateDeviceModal.tsx        # Device update modal
└── index.ts                     # Component exports
```

**Note**: See [components.md](./components.md) for detailed component documentation.

### Pages (`src/pages/`)

Page-level components that handle routing.

```
pages/
├── Admin.tsx                      # Admin dashboard
├── AdminDeviceManagement.tsx      # Admin device management
├── AdminDeviceTypeManagement.tsx  # Admin device type management
├── AdminESPDeviceManagement.tsx   # Admin ESP device management
├── AdminUserManagement.tsx        # Admin user management
├── AllReadings.tsx                # All readings page
├── AuditLogs.tsx                  # Audit logs page
├── Configuration.tsx              # Configuration page
├── Dashboard.tsx                  # Main dashboard
├── DeviceDetail.tsx               # Device detail page
├── DeviceReadingsHistory.tsx      # Device readings history
├── DeviceStateHistory.tsx         # Device state history
├── Devices.tsx                    # All devices page
├── LocationDetails.tsx            # Location details page
├── Locations.tsx                  # All locations page
├── Login.tsx                      # Login page
├── MapView.tsx                    # Map view page
├── MicrocontrollerDetail.tsx      # Microcontroller detail page
├── MyDevices.tsx                  # User's devices page
├── MyMicrocontrollers.tsx         # User's microcontrollers page
├── Profile.tsx                    # User profile page
├── Register.tsx                   # Registration page
└── Versions.tsx                   # Versions page
```

### State Management (`src/store/`)

Zustand stores for global state management.

```
store/
├── authStore.ts        # Authentication state
├── devicesStore.ts     # Devices state and caching
├── searchStore.ts      # Search state
└── themeStore.ts       # Theme (dark/light mode) state
```

**Note**: See [state-management.md](./state-management.md) for details on each store.

### Utilities (`src/utils/`)

Shared utility functions and helpers.

```
utils/
└── [various utility files]
```

## Configuration Files

### `package.json`
Defines project dependencies and scripts:
- `dev`: Start development server
- `build`: Build for production
- `preview`: Preview production build

### `vite.config.ts`
Vite build tool configuration, including:
- React plugin setup
- Build optimizations
- Development server settings

### `tailwind.config.js`
Tailwind CSS configuration:
- Custom theme colors
- Responsive breakpoints
- Plugin configurations

### `tsconfig.json`
TypeScript compiler configuration:
- Strict type checking
- Module resolution
- JSX support

### `.env.example`
Template for environment variables:
- API base URL
- Feature flags
- Other configuration

## Build Output

When building for production (`npm run build`), Vite generates:
- `dist/`: Production-ready static files
- Optimized and minified JavaScript
- CSS bundles
- Static assets

## Design Patterns Used

1. **Clean Architecture**: Separation of domain, application, infrastructure, and presentation layers
2. **Dependency Injection**: Container-based DI for loose coupling
3. **Repository Pattern**: Abstract data access through repository interfaces
4. **Use Case Pattern**: Encapsulate business logic in discrete use cases
5. **Facade Pattern**: API layer provides simplified interface to complex subsystems
6. **Component Composition**: Reusable, composable React components

## Module Dependencies

```
┌─────────────────┐
│  Presentation   │ (Pages, Components)
│     Layer       │
└────────┬────────┘
         │ uses
         ▼
┌─────────────────┐
│   API Layer     │ (api/)
└────────┬────────┘
         │ uses
         ▼
┌─────────────────┐
│  Application    │ (usecases/, di/)
│     Layer       │
└────────┬────────┘
         │ uses
         ▼
┌─────────────────┐
│  Domain Layer   │ (entities/, repositories/)
└────────┬────────┘
         ▲
         │ implements
         │
┌─────────────────┐
│Infrastructure   │ (repositories/, http/)
│     Layer       │
└─────────────────┘
```

This structure ensures:
- Clear separation of concerns
- Testability (can mock repositories)
- Maintainability (changes in one layer don't affect others)
- Scalability (easy to add new features)
