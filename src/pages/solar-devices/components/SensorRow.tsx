import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ConnectedDeviceDTO } from '../../../domain/entities/Device';
import { DeviceStateBadge } from '../../../components/ui/Badge';
import { DeviceTypeIcon } from '../../../components/ui/DeviceTypeIcon';

export interface SensorRowProps {
  sensor: ConnectedDeviceDTO;
  onClick: () => void;
}

export const SensorRow: React.FC<SensorRowProps> = ({ sensor, onClick }) => {
  const ht = sensor.hardware_type ?? 3;

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.625rem 0.875rem',
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-tertiary)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-focus)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-secondary)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-secondary)'; }}
    >
      <DeviceTypeIcon hardwareType={ht} size={14} />
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{sensor.name}</span>
        {sensor.type && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>· {sensor.type}</span>}
      </div>
      <DeviceStateBadge state={sensor.device_state} />
      <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </button>
  );
};
