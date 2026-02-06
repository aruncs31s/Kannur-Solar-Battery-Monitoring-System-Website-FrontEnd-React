import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Activity } from 'lucide-react';
import { MicrocontrollerDTO } from '../domain/entities/Device';

interface MicrocontrollerCardProps {
  device: MicrocontrollerDTO;
  index?: number;
}

export const MicrocontrollerCard = ({ device, index = 0 }: MicrocontrollerCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'online':
        return 'text-green-500';
      case 'offline':
      case 'inactive':
        return 'text-gray-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link to={`/devices/mc/${device.id}`} className="block">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 flex items-center gap-2">
              <Cpu size={20} className="text-blue-500" />
              {device.name}
            </h3>
          </Link>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(device.status)} bg-current/10`}>
          {device.status}
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg px-3 py-2">
            <Activity size={16} className="text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Firmware</p>
              <p className="font-semibold text-gray-800 dark:text-white text-xs truncate">{device.firmware_version}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg px-3 py-2">
            <Wifi size={16} className="text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">MAC</p>
              <p className="font-semibold text-gray-800 dark:text-white text-xs truncate">{device.mac_address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
          <Wifi size={16} className="text-gray-500" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">IP Address</p>
            <p className="font-medium text-gray-800 dark:text-white font-mono text-xs">{device.ip_address || 'Not assigned'}</p>
          </div>
        </div>

        {device.used_by && (
          <div className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg px-3 py-2">
            <Activity size={16} className="text-purple-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Used By</p>
              <p className="font-medium text-gray-800 dark:text-white text-xs">{device.used_by}</p>
            </div>
          </div>
        )}

        {device.connected_sensors && (
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 rounded-lg px-3 py-2">
            <Activity size={16} className="text-green-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Connected Sensors</p>
              <p className="font-medium text-gray-800 dark:text-white text-xs">Active</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
