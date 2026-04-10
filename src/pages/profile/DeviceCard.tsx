import { Link } from 'react-router-dom';
import { HardDrive, MapPin, Wifi, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DeviceResponseDTO } from '../../domain/entities/Device';

export interface DeviceCardProps {
  device: DeviceResponseDTO;
  getStatusText: (state: number) => string;
}

export const DeviceCard = ({ device, getStatusText }: DeviceCardProps) => {
  const getStatusIcon = () => {
    switch (device.device_state) {
      case 1:
        return <CheckCircle className="text-success-500" size={20} />;
      case 0:
        return <XCircle className="text-error-500" size={20} />;
      default:
        return <AlertCircle className="text-warning-500" size={20} />;
    }
  };

  return (
    <Link
      to={`/devices/${device.id}`}
      className="card card-interactive"
    >
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <div style={{ padding: '0.5rem', background: 'var(--mc-bg)', borderRadius: 'var(--radius-md)', color: 'var(--mc-color)' }}>
              <HardDrive size={18} />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary m-0" style={{ fontSize: '1rem' }}>{device.name}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>Type: {device.type}</p>
            </div>
          </div>
          {getStatusIcon()}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div style={{ padding: '0.5rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
               Status
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }} className={device.device_state === 1 ? 'text-success' : 'text-error'}>
               {getStatusText(device.device_state)}
            </div>
          </div>
          <div style={{ padding: '0.5rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Wifi size={10} /> IP Address
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
               {device.ip_address}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-text-secondary" style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
          <MapPin size={14} />
          <span>
            {device.city}, {device.address}
          </span>
        </div>
      </div>
    </Link>
  );
};
