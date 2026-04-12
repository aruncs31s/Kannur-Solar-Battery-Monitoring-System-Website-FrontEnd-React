import { Settings, Activity } from 'lucide-react';
import { StatusBadge } from '../components/Cards';

interface DeviceInfo {
  id: number;
  name: string;
  type: string;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  address: string;
  city: string;
  device_state: number;
}

interface Reading {
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  timestamp: number;
}

interface DeviceHeaderProps {
  device: DeviceInfo;
  deviceOnline: boolean;
  latestReading: Reading | null;
  onGenerateToken: () => void;
  onBack: () => void;
  onUpdate: () => void;
  onSettings?: () => void;
}

const formatMetric = (value: number | null | undefined, unit: string) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${value.toFixed(2)} ${unit}`;
};

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return 'No data';
  return new Date(timestamp).toLocaleString();
};

export const DeviceHeader = ({
  device,
  deviceOnline,
  latestReading,
  onGenerateToken,
  onBack,
  onUpdate,
  onSettings
}: DeviceHeaderProps) => {
  const getStatusType = (stateId: number, isOnline: boolean): 'active' | 'inactive' | 'maintenance' | 'decommissioned' | 'unknown' | 'online' => {
    if (isOnline) {
      return 'online';
    }

    const states: { [key: number]: any } = {
      1: 'active',
      2: 'inactive',
      3: 'maintenance',
      4: 'decommissioned',
    };
    return states[stateId] || 'unknown';
  };

  return (
    <div className="card" style={{ background: 'linear-gradient(135deg, var(--mc-bg) 0%, var(--surface-primary) 100%)', padding: '1.5rem', border: '1px solid var(--mc-border)' }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div style={{
            padding: '0.75rem',
            background: 'var(--mc-bg)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--mc-color)',
            flexShrink: 0
          }}>
            <Settings
              onClick={onUpdate}
              className="cursor-pointer hover:scale-110 transition-transform"
              size={24}
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted">Microcontroller</p>
              <div className="badge badge-micro" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>MCU</div>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0.25rem 0' }}>{device.name}</h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{device.type} • {device.city}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={deviceOnline ? 'online' : (getStatusType(device.device_state, deviceOnline))} />
          <button
            onClick={onGenerateToken}
            className="btn btn-primary btn-sm"
          >
            <Activity size={14} />
            Generate Token
          </button>
          <button
            onClick={onSettings}
            className="btn btn-secondary btn-sm"
          >
            <Settings size={14} />
            Settings
          </button>
          <button
            onClick={onBack}
            className="btn btn-secondary btn-sm"
          >
            ← Back
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="metric-card" style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-secondary)' }}>
          <p className="metric-label" style={{ color: 'var(--nord-10)' }}>Voltage</p>
          <p className="metric-value" style={{ color: 'var(--nord-10)' }}>{formatMetric(latestReading?.voltage ?? null, 'V')}</p>
          <p className="metric-sub">{formatTimestamp(latestReading?.timestamp)}</p>
        </div>
        <div className="metric-card" style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-secondary)' }}>
          <p className="metric-label" style={{ color: 'var(--success)' }}>Current</p>
          <p className="metric-value" style={{ color: 'var(--success)' }}>{formatMetric(latestReading?.current ?? null, 'A')}</p>
          <p className="metric-sub">{formatTimestamp(latestReading?.timestamp)}</p>
        </div>
        <div className="metric-card" style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-secondary)' }}>
          <p className="metric-label" style={{ color: 'var(--nord-15)' }}>Power</p>
          <p className="metric-value" style={{ color: 'var(--nord-15)' }}>{formatMetric(latestReading?.power ?? null, 'W')}</p>
          <p className="metric-sub">{formatTimestamp(latestReading?.timestamp)}</p>
        </div>
      </div>
    </div>
  );
};