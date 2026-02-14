import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Wifi, WifiOff, Cpu, Network } from 'lucide-react';

interface LocationDeviceCardProps {
  device: {
    id: number;
    name: string;
    type: string;
    hardware_type: number;
    status: string;
    ip_address: string;
    mac_address: string;
    firmware_version: string;
  };
  index: number;
}

export const LocationDeviceCard = ({ device, index }: LocationDeviceCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'online':
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'offline':
      case 'inactive':
        return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default:
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'online':
      case 'active':
        return <Wifi size={16} />;
      case 'offline':
      case 'inactive':
        return <WifiOff size={16} />;
      default:
        return <Network size={16} />;
    }
  };

  return (
    <Link to={`/devices/${device.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow cursor-pointer"
      >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Cpu className="text-primary-600 dark:text-primary-400" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{device.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">ID: {device.id}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
          {getStatusIcon(device.status)}
          <span className="capitalize">{device.status || 'unknown'}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{device.type}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Hardware Type</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{device.hardware_type}</span>
        </div>

        {device.ip_address && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">IP Address</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">{device.ip_address}</span>
          </div>
        )}

        {device.mac_address && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">MAC Address</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white font-mono">{device.mac_address}</span>
          </div>
        )}

        {device.firmware_version && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Firmware</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{device.firmware_version}</span>
          </div>
        )}
      </div>
    </motion.div>
    </Link>
  );
};