import { Edit, History } from 'lucide-react';
import { StatusBadge } from './Cards';
import { DeviceStatus } from '../domain/entities/Device';
import { Reading } from '../domain/entities/Reading';

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

interface DeviceInfoCardProps {
  device: DeviceInfo;
  status: DeviceStatus | 'online';
  latestReading: Reading | null;
  onUpdate: () => void;
  onViewHistory: () => void;
}

export const DeviceInfoCard = ({
  device,
  status,
  latestReading,
  onUpdate,
  onViewHistory,
}: DeviceInfoCardProps) => {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="section-title">Device Information</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onUpdate}
            className="btn btn-icon btn-secondary"
            title="Update Device"
            style={{ width: 32, height: 32, padding: 0 }}
          >
            <Edit size={16} />
          </button>
        </div>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</span>
            <div style={{ marginTop: '0.4rem' }}>
              <StatusBadge status={status} />
              {latestReading && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.4rem' }}>
                  Last: {new Date(latestReading.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hardware Type</span>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.4rem' }}>{device.type}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>IP Address</span>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.4rem', fontFamily: 'monospace' }}>{device.ip_address}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>MAC Address</span>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.4rem', fontFamily: 'monospace' }}>{device.mac_address}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Firmware</span>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.4rem' }}>v{device.firmware_version}</p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location</span>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.4rem' }}>{device.city}</p>
          </div>
        </div>

        <button
          onClick={onViewHistory}
          className="btn btn-secondary"
          style={{ marginTop: '0.5rem', justifyContent: 'center' }}
        >
          <History size={16} />
          View State History
        </button>
      </div>
    </div>
  );
};
