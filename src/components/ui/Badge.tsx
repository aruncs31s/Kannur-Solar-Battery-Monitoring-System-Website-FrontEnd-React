import React from 'react';

type BadgeVariant =
  | 'active' | 'inactive' | 'online' | 'offline' | 'maintenance' | 'decommissioned' | 'initialized'
  | 'solar' | 'micro' | 'sensor' | 'actuator'
  | 'info' | 'warning' | 'error' | 'success' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantToClass: Record<BadgeVariant, string> = {
  active: 'badge-active',
  online: 'badge-active',
  success: 'badge-active',
  inactive: 'badge-inactive',
  offline: 'badge-inactive',
  initialized: 'badge-info',
  maintenance: 'badge-warning',
  warning: 'badge-warning',
  decommissioned: 'badge-error',
  error: 'badge-error',
  solar: 'badge-solar',
  micro: 'badge-micro',
  sensor: 'badge-sensor',
  actuator: 'badge-actuator',
  info: 'badge-info',
  default: '',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  icon,
  className = '',
  dot = false,
}) => {
  const cls = variantToClass[variant] || '';

  return (
    <span className={`badge ${cls} ${className}`}>
      {dot && (
        <span
          className="inline-block rounded-full"
          style={{
            width: 6,
            height: 6,
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

// Convenience: Maps device_state integer to a badge variant
export const DeviceStateBadge: React.FC<{ state: number; className?: string }> = ({ state, className }) => {
  const stateMap: Record<number, { variant: BadgeVariant; label: string }> = {
    1: { variant: 'active', label: 'Active' },
    2: { variant: 'inactive', label: 'Inactive' },
    3: { variant: 'maintenance', label: 'Maintenance' },
    4: { variant: 'decommissioned', label: 'Decommissioned' },
    5: { variant: 'initialized', label: 'Initialized' },
  };

  const info = stateMap[state] ?? { variant: 'default', label: 'Unknown' };

  return (
    <Badge variant={info.variant} dot className={className}>
      {info.label}
    </Badge>
  );
};
