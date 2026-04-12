import { Link } from 'react-router-dom';
import { HardDrive } from 'lucide-react';
import { DeviceCard } from './DeviceCard';
import { DeviceResponseDTO } from '../../domain/entities/Device';

export interface DevicesTabProps {
  devices: DeviceResponseDTO[];
  loading: boolean;
  getStatusText: (state: number) => string;
}

export const DevicesTab = ({ devices, loading, getStatusText }: DevicesTabProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-12">
        <HardDrive className="mx-auto text-text-secondary mb-4" size={48} />
        <p className="text-text-secondary">No devices found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-text-primary">My Devices</h3>
        <Link
          to="/devices"
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View All Devices →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            getStatusText={getStatusText}
          />
        ))}
      </div>
    </div>
  );
};
