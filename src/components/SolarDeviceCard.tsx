import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Battery, Zap, MapPin, Wifi, Sun } from 'lucide-react';
import { SolarDeviceView } from '../domain/entities/Device';

interface SolarDeviceCardProps {
  device: SolarDeviceView;
  index?: number;
}

export const SolarDeviceCard = ({ device, index = 0 }: SolarDeviceCardProps) => {
  const getLedStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'on':
      case 'charging':
        return 'text-green-500';
      case 'off':
      case 'standby':
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
      className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-2xl hover:border-yellow-300 dark:hover:border-yellow-600 transition-all bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link to={`/devices/${device.id}`} className="block">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 flex items-center gap-2">
              <Sun size={20} className="text-yellow-500" />
              {device.name}
            </h3>
          </Link>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getLedStatusColor(device.led_status)} bg-current/10`}>
          {device.led_status}
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg px-3 py-2">
            <Zap size={16} className="text-yellow-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Charging</p>
              <p className="font-semibold text-gray-800 dark:text-white">{device.charging_current}A</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg px-3 py-2">
            <Battery size={16} className="text-blue-600" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Battery</p>
              <p className="font-semibold text-gray-800 dark:text-white">{device.battery_voltage}V</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
          <Wifi size={16} className="text-gray-500" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">Connected Device</p>
            <p className="font-medium text-gray-800 dark:text-white font-mono text-xs">{device.connected_device_ip || 'Not connected'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
          <MapPin size={16} className="text-gray-500" />
          <div className="flex-1">
            <p className="font-medium text-gray-800 dark:text-white">{device.address}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{device.city}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};