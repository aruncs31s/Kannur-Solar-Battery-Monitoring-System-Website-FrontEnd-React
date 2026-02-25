# Kannur Solar Battery Monitoring System - Frontend Documentation

## Overview

This is a React-based frontend application for the Kannur Solar Battery Monitoring System. The application provides real-time monitoring, management, and analytics for solar battery systems deployed across various locations.

## Technology Stack

- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 7.3.1
- **Routing**: React Router DOM v6.20.0
- **State Management**: Zustand 4.4.7
- **HTTP Client**: Axios 1.6.2
- **UI Libraries**:
  - Tailwind CSS 3.3.6 (styling)
  - Framer Motion 12.29.2 (animations)
  - Lucide React 0.294.0 (icons)
  - Recharts 2.15.4 (data visualization)
  - React Leaflet 4.2.1 (maps)

## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── api/               # API layer - exposes business logic to components
├── application/       # Application layer (use cases, DI container)
├── domain/           # Domain layer (entities, repository interfaces)
├── infrastructure/   # Infrastructure layer (HTTP client, repository implementations)
├── components/       # Reusable UI components
├── pages/           # Page-level components (route handlers)
├── store/           # Zustand state management stores
└── utils/           # Utility functions
```

### Layer Responsibilities

1. **Domain Layer** (`src/domain/`)
   - Contains core business entities and repository interfaces
   - Technology-agnostic
   - No dependencies on external libraries

2. **Application Layer** (`src/application/`)
   - Contains use cases (business logic)
   - Dependency Injection container
   - Orchestrates domain entities and repositories

3. **Infrastructure Layer** (`src/infrastructure/`)
   - Implements repository interfaces
   - HTTP client configuration
   - External service integrations

4. **API Layer** (`src/api/`)
   - Provides a clean interface for components to interact with business logic
   - Wraps use cases from the application layer
   - Acts as a facade to simplify component integration

5. **Presentation Layer** (`src/components/`, `src/pages/`)
   - React components for UI
   - Pages handle routing
   - Components are reusable UI elements

## Documentation Structure

- [APIs Documentation](./apis.md) - All available APIs and their usage
- [Project Structure](./project-structure.md) - Detailed folder structure
- [Reusable Components](./components.md) - Documentation of all reusable components
- [State Management](./state-management.md) - Zustand stores and their usage
- [Routing](./routing.md) - Application routes and navigation

## Quick Start

### Development

```bash
npm install
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Key Features

1. **Device Management**
   - Monitor solar devices and microcontrollers
   - Control device states
   - Firmware updates (OTA and online builder)

2. **Real-time Monitoring**
   - Live device readings
   - Historical data visualization
   - Progressive data updates

3. **Location-based Organization**
   - Manage devices by geographical location
   - Map view for device visualization
   - Location-specific analytics

4. **User Management**
   - Authentication and authorization
   - Role-based access control
   - User profile management

5. **Admin Features**
   - Device type management
   - User administration
   - ESP device management
   - Audit logs

6. **Version Management**
   - Track application versions
   - Feature management per version

## Environment Configuration

The application uses environment variables for configuration. See `.env.example` for required variables.

## Contributing

When contributing to this project:
1. Follow the Clean Architecture principles
2. Maintain separation of concerns
3. Write TypeScript with proper typing
4. Create reusable components when possible
5. Document new APIs and components
