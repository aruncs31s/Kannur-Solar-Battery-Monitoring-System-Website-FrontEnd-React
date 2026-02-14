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
  onUpdate
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
    <div className="rounded-2xl border border-border-primary bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-emerald-500/10 p-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/15 text-primary-600 dark:text-primary-300">
            <Settings
              onClick={onUpdate}
              className="cursor-pointer hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
              size={24}
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Microcontroller</p>
            <h1 className="text-3xl font-bold text-text-primary">{device.name}</h1>
            <p className="text-sm text-text-secondary">{device.type} • {device.city}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={deviceOnline ? 'online' : getStatusType(device.device_state, deviceOnline)} />
          <span className="rounded-full bg-surface-secondary px-4 py-1 text-sm font-semibold text-text-secondary">
            Last updated: {formatTimestamp(latestReading?.timestamp)}
          </span>
          <button
            onClick={onGenerateToken}
            className="rounded-full bg-blue-600 hover:bg-blue-700 px-4 py-1 text-sm font-semibold text-white transition-colors flex items-center gap-2"
          >
            <Activity size={16} />
            Generate Token
          </button>
          <button
            onClick={onBack}
            className="rounded-full border border-border-primary px-4 py-1 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
          >
            ← Back to Devices
          </button>
        </div>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border-primary bg-surface-primary/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Latest Voltage</p>
          <p className="mt-2 text-2xl font-bold text-text-primary">{formatMetric(latestReading?.voltage ?? null, 'V')}</p>
        </div>
        <div className="rounded-xl border border-border-primary bg-surface-primary/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Latest Current</p>
          <p className="mt-2 text-2xl font-bold text-text-primary">{formatMetric(latestReading?.current ?? null, 'A')}</p>
        </div>
        <div className="rounded-xl border border-border-primary bg-surface-primary/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Latest Power</p>
          <p className="mt-2 text-2xl font-bold text-text-primary">{formatMetric(latestReading?.power ?? null, 'W')}</p>
        </div>
      </div>
    </div>
  );
};