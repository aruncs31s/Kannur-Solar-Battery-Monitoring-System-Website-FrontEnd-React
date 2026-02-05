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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Device Information</h2>
        <div className="flex gap-2">
          <button
            onClick={onUpdate}
            className="p-2 text-nord-8 hover:text-nord-9 hover:bg-nord-6 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Update Device"
          >
            <Edit size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">Status</span>
          <div className="mt-1 space-y-1">
            <StatusBadge status={status} />
            {latestReading && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Last reading: {new Date(latestReading.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">Type</span>
          <p className="text-gray-900 dark:text-white font-medium">{device.type}</p>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">IP Address</span>
          <p className="text-gray-900 dark:text-white font-medium">{device.ip_address}</p>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">MAC Address</span>
          <p className="text-gray-900 dark:text-white font-medium">{device.mac_address}</p>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">Firmware</span>
          <p className="text-gray-900 dark:text-white font-medium">{device.firmware_version}</p>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">Location</span>
          <p className="text-gray-900 dark:text-white font-medium">{device.address}, {device.city}</p>
        </div>
      </div>
      <button
        onClick={onViewHistory}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-nord-8 hover:bg-nord-9 text-white rounded-lg transition-colors"
      >
        <History size={16} />
        View State History
      </button>
    </div>
  );
};
