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
      className="bg-surface-secondary border border-border-primary rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <HardDrive className="text-primary-500" size={20} />
          <h4 className="font-semibold text-text-primary">{device.name}</h4>
        </div>
        {getStatusIcon()}
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="font-medium">Status:</span>
          <span
            className={
              device.device_state === 1 ? 'text-success-600' : 'text-error-600'
            }
          >
            {getStatusText(device.device_state)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <MapPin size={14} />
          <span>
            {device.city}, {device.address}
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Wifi size={14} />
          <span>{device.ip_address}</span>
        </div>
        <div className="text-text-secondary">
          <span className="font-medium">Type:</span> {device.type}
        </div>
      </div>
    </Link>
  );
};
