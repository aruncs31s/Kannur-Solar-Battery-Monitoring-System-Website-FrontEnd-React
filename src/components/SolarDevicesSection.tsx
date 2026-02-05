import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, TrendingUp } from 'lucide-react';
import { SolarDeviceCard } from './SolarDeviceCard';
import { SolarDeviceView } from '../domain/entities/Device';

interface SolarDevicesSectionProps {
  devices: SolarDeviceView[];
  maxDevices?: number;
  title?: string;
  showViewAllLink?: boolean;
}

export const SolarDevicesSection = ({
  devices,
  maxDevices = 6,
  title = "Solar Devices",
  showViewAllLink = true
}: SolarDevicesSectionProps) => {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
            <Sun className="text-white" size={24} />
          </div>
          {title}
        </h2>
        {showViewAllLink && (
          <Link
            to="/devices"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-semibold transition-colors"
          >
            View All
            <TrendingUp size={16} />
          </Link>
        )}
      </div>

      {devices.length === 0 ? (
        <div className="text-center py-12">
          <Sun className="mx-auto text-yellow-500 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            No Solar Devices Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't added any solar devices yet.
          </p>
          <Link
            to="/devices"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
          >
            <Sun size={20} />
            View All Devices
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.slice(0, maxDevices).map((device, idx) => (
            <SolarDeviceCard key={device.id} device={device} index={idx} />
          ))}
        </div>
      )}
    </motion.div>
  );
};