// Re-export all shared UI components from a single entry point
export { Button } from './ui/Button';
export { Badge, DeviceStateBadge } from './ui/Badge';
export { DeviceTypeIcon, getHardwareTypeInfo, isSolarDevice, isMicrocontroller, isSensor, isActuator, HARDWARE_TYPES } from './ui/DeviceTypeIcon';
export { ReadingMetricsCard } from './ui/ReadingMetricsCard';
export { HierarchyBreadcrumb } from './ui/HierarchyBreadcrumb';
export type { BreadcrumbItem } from './ui/HierarchyBreadcrumb';

// Legacy exports (keep existing)
export { StatusBadge, StatsCard } from './Cards';
export { EmptyState } from './EmptyState';
export { LoadingState } from './LoadingState';
export { PageHeader } from './PageHeader';
export { PageHeaderWithBack } from './PageHeaderWithBack';
export { Section } from './Section';
export { Modal } from './Modal';
export { Tabs } from './Tabs';
export { SearchBar } from './SearchBar';
export { BackButton } from './BackButton';

// Additional component exports used by existing pages
export { DeviceHeader } from './DeviceHeader';
export { FirmwareUploadModal } from './FirmwareUploadModal';
export { FirmwareBuilderModal } from './FirmwareBuilderModal';
export { OnlineFirmwareBuilder } from './OnlineFirmwareBuilder';
export { OTAFirmwareUpload } from './OTAFirmwareUpload';
export { Codegen } from './Codegen';
export { DataTable } from './DataTable';
export { ActionButton } from './ActionButton';
export { FormError, FormField } from './FormComponents';

