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
      className="border border-border-primary rounded-2xl p-5 hover:shadow-2xl hover:border-warning transition-all bg-surface-secondary"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Link to={`/devices/${device.id}`} className="block">
            <h3 className="font-bold text-lg text-text-primary mb-1 flex items-center gap-2">
              <Sun size={20} className="text-warning" />
              {device.name}
            </h3>
          </Link>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getLedStatusColor(device.led_status)} bg-current/10`}>
          {device.led_status}
        </div>
      </div>

      <div className="space-y-3 text-sm text-text-secondary">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-warning-bg rounded-lg px-3 py-2 border border-warning-border">
            <Zap size={16} className="text-warning" />
            <div>
              <p className="text-[10px] text-text-muted uppercase font-bold">Charging</p>
              <p className="font-bold text-text-primary">{device.charging_current.toFixed(2)}A</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-info-bg rounded-lg px-3 py-2 border border-info-border">
            <Battery size={16} className="text-info" />
            <div>
              <p className="text-[10px] text-text-muted uppercase font-bold">Battery</p>
              <p className="font-bold text-text-primary">{device.battery_voltage.toFixed(2)}V</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-tertiary rounded-lg px-3 py-2">
          <Wifi size={16} className="text-text-muted" />
          <div className="flex-1">
            <p className="text-[10px] text-text-muted uppercase font-bold">Linked Node</p>
            <p className="font-mono text-xs text-text-primary">{device.connected_device_ip || 'Not connected'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-tertiary rounded-lg px-3 py-2">
          <MapPin size={16} className="text-text-muted" />
          <div className="flex-1">
            <p className="font-semibold text-text-primary">{device.address}</p>
            <p className="text-xs text-text-secondary">{device.city}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};