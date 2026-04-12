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
      <div className="bg-background-primary rounded-xl shadow-lg border border-border-primary overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-error/5 to-warning/5 border-b border-border-primary">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-error/10 p-1.5 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-error" />
            </div>
            <h3 className="font-bold text-text-primary tracking-tight">System Alerts</h3>
            <span className="bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm shadow-error/20">
              {alerts.length} active
            </span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`p-4 rounded-xl border-l-4 shadow-sm transition-all hover:shadow-md ${
                  alert.type === 'critical'
                    ? 'bg-error-bg border-error'
                    : 'bg-warning-bg border-warning'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2 h-2 rounded-full shadow-sm ${
                        alert.type === 'critical' ? 'bg-error animate-pulse' : 'bg-warning'
                      }`} />
                      <h4 className="font-bold text-text-primary">{alert.title}</h4>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{alert.message}</p>
                    {alert.deviceName && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Device:</span>
                        <span className="text-xs font-semibold text-text-primary bg-surface-secondary px-2 py-0.5 rounded-md border border-border-primary">
                          {alert.deviceName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {alert.deviceId && onViewDevice && (
                      <button
                        onClick={() => onViewDevice(alert.deviceId!)}
                        className="text-primary-500 hover:text-primary-600 font-bold text-xs flex items-center gap-1.5 p-2 rounded-lg hover:bg-primary-500/10 transition-all uppercase tracking-wider"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    )}
                    {onAcknowledge && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="text-success hover:text-success/80 font-bold text-xs flex items-center gap-1.5 p-2 rounded-lg hover:bg-success/10 transition-all uppercase tracking-wider"
                      >
                        <CheckCircle size={16} />
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="text-text-muted hover:text-error p-2 rounded-lg hover:bg-error/10 transition-all active:scale-90"
                    >
                      <X size={18} />
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