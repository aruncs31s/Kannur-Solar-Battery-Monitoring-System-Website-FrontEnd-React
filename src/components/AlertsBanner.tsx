import { motion } from 'framer-motion';
import { AlertTriangle, X, Eye, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning';
  title: string;
  message: string;
  deviceId?: number;
  deviceName?: string;
}

interface AlertsBannerProps {
  alerts: Alert[];
  onDismiss: (alertId: string) => void;
  onViewDevice?: (deviceId: number) => void;
  onAcknowledge?: (alertId: string) => void;
}

export const AlertsBanner = ({ alerts, onDismiss, onViewDevice, onAcknowledge }: AlertsBannerProps) => {
  if (alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-red-50 to-yellow-50 dark:from-red-900/20 dark:to-yellow-900/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">System Alerts</h3>
            <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">
              {alerts.length} active
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'critical'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        alert.type === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <h4 className="font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{alert.message}</p>
                    {alert.deviceName && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Device: {alert.deviceName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {alert.deviceId && onViewDevice && (
                      <button
                        onClick={() => onViewDevice(alert.deviceId!)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    )}
                    {onAcknowledge && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium flex items-center gap-1"
                      >
                        <CheckCircle size={14} />
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};