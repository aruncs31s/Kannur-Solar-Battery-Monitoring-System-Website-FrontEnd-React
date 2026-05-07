# Reusable Components Documentation

This document describes all reusable UI components available in the application. All components are located in `src/components/`.

## Core UI Components

### Modal (`Modal.tsx`)

A reusable modal/dialog component with animations.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;           // Controls modal visibility
  onClose: () => void;       // Callback when modal is closed
  title: string;             // Modal title
  children: ReactNode;       // Modal content
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';  // Modal size (default: 'lg')
  showCloseButton?: boolean; // Show close button (default: true)
}
```

**Features:**
- Animated entrance/exit with Framer Motion
- Backdrop blur effect
- Multiple size options
- Click outside to close
- Accessible close button

**Example:**
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)} 
  title="Device Details"
  size="xl"
>
  <div>Modal content here</div>
</Modal>
```

---

### Cards (`Cards.tsx`)

#### StatusBadge

Displays device status with color-coded badges.

**Props:**
```typescript
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error' | 'maintenance' | 'decommissioned' | 'unknown' | 'online';
}
```

**Features:**
- Color-coded badges for different statuses
- Icons for each status type
- Pulse animation for active/error states
- Memoized for performance

**Status Colors:**
- `active`/`online`: Green (with pulse)
- `inactive`: Yellow/Warning
- `error`: Red (with pulse)
- `maintenance`: Blue/Info
- `decommissioned`: Gray
- `unknown`: Light blue

**Example:**
```tsx
<StatusBadge status="active" />
```

#### StatsCard

Display statistics with optional trend indicators.

**Props:**
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ComponentType;
  trend?: 'up' | 'down';
  trendValue?: string;
}
```

**Example:**
```tsx
<StatsCard 
  title="Total Devices" 
  value={42} 
  icon={DeviceIcon}
  trend="up"
  trendValue="+12%"
/>
```

---

### DataTable (`DataTable.tsx`)

Generic data table component for displaying tabular data.

**Props:**
```typescript
interface DataTableProps {
  columns: Column[];        // Column definitions
  data: any[];             // Table data
  loading?: boolean;       // Show loading state
  emptyMessage?: string;   // Message when no data
}
```

**Features:**
- Sortable columns
- Responsive design
- Loading state
- Empty state handling
- Custom cell renderers

**Example:**
```tsx
<DataTable 
  columns={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status' }
  ]}
  data={devices}
  loading={isLoading}
  emptyMessage="No devices found"
/>
```

---

### LoadingState (`LoadingState.tsx`)

Displays a loading spinner with optional message.

**Props:**
```typescript
interface LoadingStateProps {
  message?: string;         // Optional loading message
  size?: 'sm' | 'md' | 'lg'; // Spinner size
}
```

**Example:**
```tsx
<LoadingState message="Loading devices..." size="lg" />
```

---

### EmptyState (`EmptyState.tsx`)

Displays when no data is available.

**Props:**
```typescript
interface EmptyStateProps {
  icon?: React.ComponentType;  // Optional icon
  title: string;              // Main message
  description?: string;       // Additional description
  action?: ReactNode;         // Optional action button
}
```

**Example:**
```tsx
<EmptyState 
  icon={InboxIcon}
  title="No devices found"
  description="Add your first device to get started"
  action={<button>Add Device</button>}
/>
```

---

## Navigation Components

### Navigation (`Navigation.tsx`)

Main application navigation menu.

**Features:**
- Responsive sidebar
- Active route highlighting
- User role-based menu items
- Collapse/expand functionality
- User profile section

---

### BackButton (`BackButton.tsx`)

Navigation button to go back to previous page.

**Props:**
```typescript
interface BackButtonProps {
  to?: string;              // Optional specific route
  label?: string;           // Button label (default: "Back")
}
```

**Example:**
```tsx
<BackButton to="/devices" label="Back to Devices" />
```

---

## Layout Components

### Layout (`Layout.tsx`)

Main application layout wrapper with navigation.

**Props:**
```typescript
interface LayoutProps {
  children: ReactNode;      // Page content
}
```

**Features:**
- Responsive layout
- Navigation integration
- Theme support (dark/light)
- Consistent padding and margins

**Example:**
```tsx
<Layout>
  <Dashboard />
</Layout>
```

---

### Section (`Section.tsx`)

Content section wrapper with title and optional actions.

**Props:**
```typescript
interface SectionProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;       // Optional action button
  className?: string;
}
```

**Example:**
```tsx
<Section title="Device Overview" action={<button>Add Device</button>}>
  <DeviceList />
</Section>
```

---

## Header Components

### PageHeader (`PageHeader.tsx`)

Standard page header with title and actions.

**Props:**
```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;      // Optional action buttons
}
```

**Example:**
```tsx
<PageHeader 
  title="Devices" 
  subtitle="Manage your devices"
  actions={<button>Add Device</button>}
/>
```

---

### PageHeaderWithBack (`PageHeaderWithBack.tsx`)

Page header with back button.

**Props:**
```typescript
interface PageHeaderWithBackProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
}
```

**Example:**
```tsx
<PageHeaderWithBack 
  title="Device Details"
  backTo="/devices"
  backLabel="Back to Devices"
/>
```

---

## Form Components

### Form Components (`FormComponents.tsx`)

Collection of form-related components.

#### FormInput

Input field with label and error handling.

**Props:**
```typescript
interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}
```

#### FormField

Generic form field wrapper.

**Props:**
```typescript
interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
}
```

#### FormError

Displays form error messages.

**Props:**
```typescript
interface FormErrorProps {
  message: string;
}
```

#### FormSuccess

Displays form success messages.

**Props:**
```typescript
interface FormSuccessProps {
  message: string;
}
```

**Example:**
```tsx
<FormInput 
  label="Device Name"
  value={name}
  onChange={setName}
  error={nameError}
  required
/>
```

---

## Interactive Components

### Tabs (`Tabs.tsx`)

Tab navigation component.

**Props:**
```typescript
interface TabsProps {
  tabs: Tab[];              // Array of tab definitions
  activeTab: string;        // Currently active tab ID
  onChange: (tabId: string) => void;
}

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}
```

**Example:**
```tsx
<Tabs 
  tabs={[
    { id: 'overview', label: 'Overview', content: <Overview /> },
    { id: 'settings', label: 'Settings', content: <Settings /> }
  ]}
  activeTab={activeTab}
  onChange={setActiveTab}
/>
```

---

### ActionButton (`ActionButton.tsx`)

Reusable button component with variants.

**Props:**
```typescript
interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: React.ComponentType;
  loading?: boolean;
  disabled?: boolean;
}
```

**Example:**
```tsx
<ActionButton 
  label="Delete Device"
  onClick={handleDelete}
  variant="danger"
  icon={TrashIcon}
  loading={isDeleting}
/>
```

---

### SearchBar (`SearchBar.tsx`)

Search input with debouncing.

**Props:**
```typescript
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;      // Debounce delay (default: 300ms)
}
```

**Example:**
```tsx
<SearchBar 
  placeholder="Search devices..."
  onSearch={handleSearch}
  debounceMs={500}
/>
```

---

## Data Display Components

### StatsGrid (`StatsGrid.tsx`)

Grid layout for displaying statistics.

**Props:**
```typescript
interface StatsGridProps {
  stats: StatItem[];
}

interface StatItem {
  label: string;
  value: string | number;
  icon?: React.ComponentType;
  trend?: 'up' | 'down';
}
```

**Example:**
```tsx
<StatsGrid 
  stats={[
    { label: 'Total Devices', value: 42, icon: DeviceIcon, trend: 'up' },
    { label: 'Online', value: 38, icon: CheckIcon }
  ]}
/>
```

---

### ReadingsTable (`ReadingsTable.tsx`)

Specialized table for displaying device readings.

**Props:**
```typescript
interface ReadingsTableProps {
  readings: Reading[];
  loading?: boolean;
}
```

**Features:**
- Formatted timestamps
- Unit display
- Color-coded values
- Sorting by timestamp

---

### DailyBreakdownCharts (`DailyBreakdownCharts.tsx`)

Charts for daily analytics.

**Props:**
```typescript
interface DailyBreakdownChartsProps {
  data: DailyData[];
  deviceName?: string;
}
```

**Features:**
- Line charts using Recharts
- Multiple metrics support
- Responsive design
- Interactive tooltips

---

## Device-Specific Components

### DeviceHeader (`DeviceHeader.tsx`)

Header component for device detail pages.

**Props:**
```typescript
interface DeviceHeaderProps {
  device: Device;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

**Features:**
- Device name and type display
- Status badge
- Action buttons (edit, delete)
- Location information

---

### DeviceInfoCard (`DeviceInfoCard.tsx`)

Card displaying device information.

**Props:**
```typescript
interface DeviceInfoCardProps {
  device: Device;
  showActions?: boolean;
}
```

---

### SolarDeviceCard (`SolarDeviceCard.tsx`)

Specialized card for solar devices.

**Props:**
```typescript
interface SolarDeviceCardProps {
  device: SolarDeviceView;
  onClick?: () => void;
}
```

**Features:**
- Solar-specific metrics
- Real-time status
- Power generation display
- Battery status

---

### MicrocontrollerCard (`MicrocontrollerCard.tsx`)

Card for microcontroller devices.

**Props:**
```typescript
interface MicrocontrollerCardProps {
  device: MicrocontrollerDTO;
  onClick?: () => void;
}
```

**Features:**
- Firmware version display
- Online/offline status
- Last seen timestamp
- Connection status

---

### LocationDeviceCard (`LocationDeviceCard.tsx`)

Device card with location context.

**Props:**
```typescript
interface LocationDeviceCardProps {
  device: LocationDeviceDTO;
  locationName?: string;
}
```

---

## Section Components

### LiveReadingsSection (`LiveReadingsSection.tsx`)

Section displaying live device readings.

**Props:**
```typescript
interface LiveReadingsSectionProps {
  deviceId: number;
  refreshInterval?: number;  // Auto-refresh interval in ms
}
```

**Features:**
- Auto-refresh
- Real-time updates
- Reading charts
- Current values display

---

### SolarDevicesSection (`SolarDevicesSection.tsx`)

Section displaying solar devices.

**Props:**
```typescript
interface SolarDevicesSectionProps {
  devices: SolarDeviceView[];
  loading?: boolean;
}
```

---

### MicrocontrollersSection (`MicrocontrollersSection.tsx`)

Section displaying microcontrollers.

**Props:**
```typescript
interface MicrocontrollersSectionProps {
  devices: MicrocontrollerDTO[];
  loading?: boolean;
}
```

---

### AllDevicesSection (`AllDevicesSection.tsx`)

Section displaying all devices.

**Props:**
```typescript
interface AllDevicesSectionProps {
  devices: DeviceResponseDTO[];
  loading?: boolean;
}
```

---

## Modal Components

### AddDeviceForm (`AddDeviceForm.tsx`)

Form component for adding new devices.

**Props:**
```typescript
interface AddDeviceFormProps {
  onSubmit: (data: CreateDeviceDTO) => void;
  onCancel: () => void;
}
```

---

### AddSolarDeviceModal (`AddSolarDeviceModal.tsx`)

Modal for adding solar devices.

**Props:**
```typescript
interface AddSolarDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
```

---

### AddSensorDeviceModal (`AddSensorDeviceModal.tsx`)

Modal for adding sensor devices.

**Props:**
```typescript
interface AddSensorDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}
```

---

### UpdateDeviceModal (`UpdateDeviceModal.tsx`)

Modal for updating device information.

**Props:**
```typescript
interface UpdateDeviceModalProps {
  isOpen: boolean;
  device: DeviceResponseDTO;
  onClose: () => void;
  onSuccess?: () => void;
}
```

---

### DeviceTokenModal (`DeviceTokenModal.tsx`)

Modal for generating device authentication tokens.

**Props:**
```typescript
interface DeviceTokenModalProps {
  isOpen: boolean;
  deviceId: number;
  onClose: () => void;
}
```

**Features:**
- Token generation
- Copy to clipboard
- QR code display (optional)
- Security warning

---

## Firmware Components

### FirmwareUploadModal (`FirmwareUploadModal.tsx`)

Modal for uploading firmware files.

**Props:**
```typescript
interface FirmwareUploadModalProps {
  isOpen: boolean;
  deviceId: number;
  onClose: () => void;
  onSuccess?: () => void;
}
```

**Features:**
- File upload with drag & drop
- Progress indicator
- Validation
- Error handling

---

### FirmwareBuilderModal (`FirmwareBuilderModal.tsx`)

Modal for online firmware building.

**Props:**
```typescript
interface FirmwareBuilderModalProps {
  isOpen: boolean;
  deviceId: number;
  onClose: () => void;
}
```

**Features:**
- Build configuration form
- Build status tracking
- Download link when complete
- Build tool selection (PlatformIO/Arduino)

---

### OTAFirmwareUpload (`OTAFirmwareUpload.tsx`)

Component for Over-The-Air firmware updates.

**Props:**
```typescript
interface OTAFirmwareUploadProps {
  deviceId: number;
}
```

**Features:**
- OTA update initiation
- Progress tracking
- Status notifications

---

### OnlineFirmwareBuilder (`OnlineFirmwareBuilder.tsx`)

Component for building firmware online.

**Props:**
```typescript
interface OnlineFirmwareBuilderProps {
  deviceId: number;
}
```

---

## Filter Components

### DateRangeFilter (`DateRangeFilter.tsx`)

Date range selection component.

**Props:**
```typescript
interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}
```

**Features:**
- Calendar picker
- Quick presets (today, last 7 days, last 30 days)
- Custom range selection
- Validation

**Example:**
```tsx
<DateRangeFilter 
  startDate={start}
  endDate={end}
  onChange={(start, end) => {
    setStart(start);
    setEnd(end);
  }}
/>
```

---

## Control Components

### DeviceControlPanel (`DeviceControlPanel.tsx`)

Panel for controlling device states.

**Props:**
```typescript
interface DeviceControlPanelProps {
  deviceId: number;
  availableActions: DeviceAction[];
}
```

**Features:**
- Action buttons for device control
- Confirmation dialogs
- Status feedback
- Permission checking

---

## System Components

### SystemHealth (`SystemHealth.tsx`)

Displays system health metrics.

**Props:**
```typescript
interface SystemHealthProps {
  metrics?: HealthMetrics;
}
```

**Features:**
- Overall health status
- Component-level metrics
- Alert indicators
- Refresh capability

---

### AlertsBanner (`AlertsBanner.tsx`)

Displays system alerts and notifications.

**Props:**
```typescript
interface AlertsBannerProps {
  alerts: Alert[];
  onDismiss?: (alertId: string) => void;
}
```

---

## Utility Components

### ProtectedRoute (`ProtectedRoute.tsx`)

Route wrapper for authentication protection.

**Props:**
```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;    // Optional role requirement
}
```

**Features:**
- Authentication check
- Role-based access control
- Redirect to login if unauthorized
- Loading state while checking auth

**Example:**
```tsx
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>
```

---

### Codegen (`Codegen.tsx`)

Code generation utility component.

**Props:**
```typescript
interface CodegenProps {
  device: Device;
  format?: 'arduino' | 'python' | 'curl';
}
```

**Features:**
- Generate code snippets for device integration
- Multiple language support
- Copy to clipboard
- Syntax highlighting

---

## Component Export

All components are re-exported from `src/components/index.ts` for easy importing:

```typescript
// Import multiple components
import { Modal, LoadingState, DataTable } from '@/components';

// Or import individually
import { Modal } from '@/components/Modal';
```

## Best Practices

1. **Use TypeScript**: All components are fully typed
2. **Memoization**: Performance-critical components use `React.memo()`
3. **Accessibility**: Components follow ARIA guidelines
4. **Responsive**: All components are mobile-friendly
5. **Theme Support**: Components support dark/light themes
6. **Error Handling**: Components handle error states gracefully
7. **Loading States**: Components show loading indicators during async operations

## Styling

Components use:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- Custom CSS variables for theming

Theme classes:
- `bg-surface-primary`, `bg-surface-secondary`: Surface colors
- `text-text-primary`, `text-text-secondary`: Text colors
- `border-border-primary`: Border colors
- `bg-primary`, `bg-success`, `bg-error`, `bg-warning`, `bg-info`: Action colors
