# Reusable Components Documentation

## Overview
This document catalogs all 46+ reusable components in the application. Components are organized by category and include usage examples.

## Component Index

All components are exported from `src/components/index.ts` for convenient importing:

```typescript
import { 
  LoadingState, 
  EmptyState, 
  DataTable,
  Modal,
  // ... etc
} from '../components';
```

---

## 1. Layout Components

### Layout (`Layout.tsx`)
Main application layout with navigation and header.

**Usage:**
```typescript
<Layout>
  <YourPageContent />
</Layout>
```

### Navigation (`Navigation.tsx`)
Application navigation menu.

**Features:**
- Responsive sidebar
- Route highlighting
- Role-based menu items

---

## 2. State Display Components

### LoadingState (`LoadingState.tsx`)
Displays loading spinner and message.

**Props:**
```typescript
interface LoadingStateProps {
  message?: string;
}
```

**Usage:**
```typescript
<LoadingState message="Loading devices..." />
```

**Default message:** "Loading..."

---

### EmptyState (`EmptyState.tsx`)
Displays empty state with icon and optional action button.

**Props:**
```typescript
interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
  iconSize?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage:**
```typescript
<EmptyState 
  message="No devices found" 
  icon={PackageOpen}
  action={{
    label: "Add Device",
    onClick: () => setShowModal(true)
  }}
/>
```

**Defaults:**
- message: "No data found"
- icon: PackageOpen
- iconSize: 48

---

## 3. Navigation Components

### BackButton (`BackButton.tsx`)
Navigation button to go back.

**Usage:**
```typescript
<BackButton />
```

**Features:**
- Uses `useNavigate()` from react-router-dom
- Navigates to previous page

---

### PageHeader (`PageHeader.tsx`)
Standard page header with title and description.

**Props:**
```typescript
interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}
```

**Usage:**
```typescript
<PageHeader 
  title="Devices" 
  description="Manage your IoT devices"
>
  <ActionButton onClick={handleAdd}>Add Device</ActionButton>
</PageHeader>
```

---

### PageHeaderWithBack (`PageHeaderWithBack.tsx`)
Page header with back button.

**Usage:**
```typescript
<PageHeaderWithBack 
  title="Device Details" 
  description="View and manage device"
/>
```

---

## 4. Data Display Components

### DataTable (`DataTable.tsx`)
Generic table component for displaying tabular data.

**Props:**
```typescript
interface Column {
  header: string;
  accessor: string | ((row: any) => ReactNode);
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  rowClassName?: string | ((row: any) => string);
  onRowClick?: (row: any) => void;
}
```

**Usage:**
```typescript
<DataTable
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
    { header: 'Location', accessor: 'location' }
  ]}
  data={devices}
  emptyMessage="No devices found"
  onRowClick={(device) => navigate(`/devices/${device.id}`)}
/>
```

**Features:**
- Sortable columns
- Clickable rows
- Custom cell rendering
- Empty state handling
- Responsive design

---

### StatsGrid (`StatsGrid.tsx`)
Grid layout for displaying statistics.

**Usage:**
```typescript
<StatsGrid>
  <StatsCard title="Total Devices" value={42} />
  <StatsCard title="Online" value={38} />
  <StatsCard title="Offline" value={4} />
</StatsGrid>
```

---

### StatsCard (`Cards.tsx`)
Card displaying a statistic.

**Props:**
```typescript
interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  className?: string;
}
```

**Usage:**
```typescript
<StatsCard
  title="Total Power"
  value="1,234 kWh"
  icon={Zap}
  change={{ value: 12, trend: 'up' }}
/>
```

---

### StatusBadge (`Cards.tsx`)
Badge for displaying status.

**Props:**
```typescript
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'error';
  label?: string;
}
```

**Usage:**
```typescript
<StatusBadge status="online" />
<StatusBadge status="offline" label="Disconnected" />
```

---

## 5. Form Components

### FormInput (`FormComponents.tsx`)
Styled form input with label.

**Props:**
```typescript
interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}
```

**Usage:**
```typescript
<FormInput
  label="Device Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  placeholder="Enter device name"
  required
/>
```

---

### FormField (`FormComponents.tsx`)
Generic form field wrapper.

**Usage:**
```typescript
<FormField label="Description">
  <textarea {...props} />
</FormField>
```

---

### FormError (`FormComponents.tsx`)
Error message display.

**Props:**
```typescript
interface FormErrorProps {
  message: string;
}
```

**Usage:**
```typescript
{error && <FormError message={error} />}
```

---

### FormSuccess (`FormComponents.tsx`)
Success message display.

**Props:**
```typescript
interface FormSuccessProps {
  message: string;
}
```

**Usage:**
```typescript
{success && <FormSuccess message="Device created successfully" />}
```

---

## 6. Modal Components

### Modal (`Modal.tsx`)
Generic modal dialog.

**Props:**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

**Usage:**
```typescript
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Add Device"
  size="lg"
>
  <AddDeviceForm onSubmit={handleSubmit} />
</Modal>
```

---

### DeviceTokenModal (`DeviceTokenModal.tsx`)
Modal for displaying device authentication token.

**Usage:**
```typescript
<DeviceTokenModal
  isOpen={showToken}
  onClose={() => setShowToken(false)}
  token={deviceToken}
  deviceId={device.id}
/>
```

---

### FirmwareUploadModal (`FirmwareUploadModal.tsx`)
Modal for uploading firmware files.

**Usage:**
```typescript
<FirmwareUploadModal
  isOpen={showUpload}
  onClose={() => setShowUpload(false)}
  deviceId={device.id}
  onSuccess={handleUploadSuccess}
/>
```

---

### FirmwareBuilderModal (`FirmwareBuilderModal.tsx`)
Modal for online firmware building.

**Features:**
- Configure build parameters
- Select build tool (PlatformIO/Arduino)
- Monitor build progress
- Download compiled firmware

---

### UpdateDeviceModal (`UpdateDeviceModal.tsx`)
Modal for updating device information.

---

### AddSensorDeviceModal (`AddSensorDeviceModal.tsx`)
Modal for adding sensor devices.

---

### AddSolarDeviceModal (`AddSolarDeviceModal.tsx`)
Modal for adding solar devices.

---

### AdvancedDeviceAddModal (`AdvancedDeviceAddModal.tsx`)
Advanced modal for adding devices with more options.

---

## 7. Action Components

### ActionButton (`ActionButton.tsx`)
Styled action button.

**Props:**
```typescript
interface ActionButtonProps {
  onClick: () => void;
  icon?: LucideIcon;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}
```

**Usage:**
```typescript
<ActionButton
  onClick={handleAdd}
  icon={Plus}
  variant="primary"
>
  Add Device
</ActionButton>
```

---

## 8. Feature Components

### Section (`Section.tsx`)
Generic section wrapper with title.

**Props:**
```typescript
interface SectionProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}
```

**Usage:**
```typescript
<Section 
  title="Recent Readings"
  actions={<ActionButton onClick={refresh}>Refresh</ActionButton>}
>
  <ReadingsTable data={readings} />
</Section>
```

---

### Tabs (`Tabs.tsx`)
Tab navigation component.

**Props:**
```typescript
interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}
```

**Usage:**
```typescript
<Tabs
  tabs={[
    { id: 'overview', label: 'Overview', content: <Overview /> },
    { id: 'settings', label: 'Settings', content: <Settings /> }
  ]}
  defaultTab="overview"
/>
```

---

### LiveReadingsSection (`LiveReadingsSection.tsx`)
Displays live sensor readings.

**Props:**
```typescript
interface LiveReadingsSectionProps {
  deviceId: number;
  refreshInterval?: number; // milliseconds
}
```

**Usage:**
```typescript
<LiveReadingsSection deviceId={device.id} refreshInterval={5000} />
```

**Features:**
- Auto-refresh
- Real-time updates
- Charts and graphs

---

### DailyBreakdownCharts (`DailyBreakdownCharts.tsx`)
Charts showing daily data breakdown.

**Usage:**
```typescript
<DailyBreakdownCharts deviceId={device.id} />
```

---

### DateRangeFilter (`DateRangeFilter.tsx`)
Date range picker for filtering data.

**Props:**
```typescript
interface DateRangeFilterProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}
```

**Usage:**
```typescript
<DateRangeFilter
  startDate={startDate}
  endDate={endDate}
  onStartDateChange={setStartDate}
  onEndDateChange={setEndDate}
/>
```

---

### SearchBar (`SearchBar.tsx`)
Search input component.

**Props:**
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
```

**Usage:**
```typescript
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Search devices..."
/>
```

---

## 9. Device-Specific Components

### DeviceHeader (`DeviceHeader.tsx`)
Header for device detail pages.

**Usage:**
```typescript
<DeviceHeader device={device} />
```

---

### DeviceInfoCard (`DeviceInfoCard.tsx`)
Card displaying device information.

**Usage:**
```typescript
<DeviceInfoCard device={device} />
```

---

### DeviceControlPanel (`DeviceControlPanel.tsx`)
Control panel for device actions.

**Props:**
```typescript
interface DeviceControlPanelProps {
  deviceId: number;
  controls: DeviceControl[];
}
```

**Usage:**
```typescript
<DeviceControlPanel
  deviceId={device.id}
  controls={[
    { label: 'Turn On', action: 1 },
    { label: 'Turn Off', action: 0 }
  ]}
/>
```

---

### SolarDeviceCard (`SolarDeviceCard.tsx`)
Card for solar device display.

---

### LocationDeviceCard (`LocationDeviceCard.tsx`)
Card for device at a location.

---

### MicrocontrollerCard (`MicrocontrollerCard.tsx`)
Card for microcontroller display.

**Usage:**
```typescript
<MicrocontrollerCard
  microcontroller={mc}
  onClick={() => navigate(`/microcontrollers/${mc.id}`)}
/>
```

---

## 10. Section Components

### SolarDevicesSection (`SolarDevicesSection.tsx`)
Section displaying solar devices.

---

### MicrocontrollersSection (`MicrocontrollersSection.tsx`)
Section displaying microcontrollers.

---

### AllDevicesSection (`AllDevicesSection.tsx`)
Section displaying all devices.

---

### SystemHealth (`SystemHealth.tsx`)
System health monitoring section.

**Features:**
- CPU usage
- Memory usage
- Disk usage
- Network status

---

### QuickActions (`QuickActions.tsx`)
Quick action links section.

**Usage:**
```typescript
<QuickActions />
```

**Displays:**
- View on Map
- Recent Readings
- Add Device
- etc.

---

### ManagementModules (`ManagementModules.tsx`)
Admin management modules section.

---

### AlertsBanner (`AlertsBanner.tsx`)
Banner for system alerts.

---

## 11. Specialized Components

### OTAFirmwareUpload (`OTAFirmwareUpload.tsx`)
Over-the-air firmware upload component.

**Props:**
```typescript
interface OTAFirmwareUploadProps {
  deviceId: number;
  onSuccess?: () => void;
}
```

---

### OnlineFirmwareBuilder (`OnlineFirmwareBuilder.tsx`)
Online firmware builder interface.

**Features:**
- Configure WiFi settings
- Configure server settings
- Select build tool
- Monitor build progress
- Download firmware

---

### Codegen (`Codegen.tsx`)
Code generation utility component.

---

### ReadingsTable (`ReadingsTable.tsx`)
Table for displaying sensor readings.

**Props:**
```typescript
interface ReadingsTableProps {
  readings: Reading[];
  columns?: string[];
}
```

---

### ProtectedRoute (`ProtectedRoute.tsx`)
Route wrapper for authentication.

**Usage:**
```typescript
<Route
  path="/devices"
  element={
    <ProtectedRoute>
      <Devices />
    </ProtectedRoute>
  }
/>
```

**Features:**
- Checks authentication
- Redirects to login if unauthenticated
- Preserves intended destination

---

## Component Best Practices

### 1. Importing Components
```typescript
// ✅ Good - Use centralized exports
import { LoadingState, EmptyState, DataTable } from '../components';

// ❌ Bad - Direct imports
import { LoadingState } from '../components/LoadingState';
```

### 2. Composition
```typescript
// ✅ Good - Compose components
<Section title="Devices">
  <SearchBar value={search} onChange={setSearch} />
  {loading && <LoadingState />}
  {!loading && devices.length === 0 && <EmptyState />}
  {!loading && devices.length > 0 && (
    <DataTable columns={columns} data={devices} />
  )}
</Section>
```

### 3. Props Typing
```typescript
// ✅ Good - Define interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
  optional?: boolean;
}

export const MyComponent = ({ title, onAction, optional = false }: MyComponentProps) => {
  // ...
};
```

### 4. State Management
```typescript
// ✅ Good - Use local state for UI, stores for shared state
const [modalOpen, setModalOpen] = useState(false); // Local UI state
const { devices } = useDevicesStore(); // Shared data state
```

### 5. Error Handling
```typescript
// ✅ Good - Handle errors gracefully
{error && <FormError message={error} />}
{loading && <LoadingState />}
{!loading && !error && data && <DataDisplay data={data} />}
```

## Styling Conventions

All components use:
- **Tailwind CSS** for styling
- **Consistent color palette** from theme
- **Responsive design** (mobile-first)
- **Dark mode support** via theme store

### Common Classes
```css
/* Surfaces */
bg-surface-primary      /* Primary background */
bg-surface-secondary    /* Secondary background */

/* Text */
text-text-primary       /* Primary text */
text-text-secondary     /* Secondary text */
text-text-tertiary      /* Tertiary text */

/* Borders */
border-border-primary   /* Primary border */

/* States */
hover:bg-surface-secondary
focus:ring-primary-500
```

## Component Testing

Components should be tested for:
1. Rendering with various props
2. User interactions (clicks, inputs)
3. Edge cases (empty data, errors)
4. Accessibility (ARIA labels, keyboard navigation)

## Accessibility Features

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus management in modals
- Screen reader friendly

## Performance Considerations

1. **Memoization**: Use React.memo for expensive components
2. **Lazy Loading**: Code split large components
3. **Virtual Scrolling**: For large lists (not yet implemented)
4. **Debouncing**: Search inputs are debounced
5. **Cleanup**: useEffect cleanup functions prevent memory leaks
