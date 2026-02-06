import { AlertCircle, CheckCircle, AlertTriangle, Settings, XCircle, HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo } from 'react';

// Status Cards Shown above
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error' | 'maintenance' | 'decommissioned' | 'unknown' | 'online';
}

export const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  const configs = {
    active: {
      bg: 'bg-success',
      text: 'text-text-primary',
      icon: CheckCircle,
      pulse: true,
    },
    inactive: {
      bg: 'bg-warning',
      text: 'text-text-primary',
      icon: AlertTriangle,
      pulse: false,
    },
    error: {
      bg: 'bg-error',
      text: 'text-text-primary',
      icon: AlertCircle,
      pulse: true,
    },
    maintenance: {
      bg: 'bg-info',
      text: 'text-text-primary',
      icon: Settings,
      pulse: false,
    },
    decommissioned: {
      bg: 'bg-surface-secondary',
      text: 'text-text-secondary',
      icon: XCircle,
      pulse: false,
    },
    unknown: {
      bg: 'bg-primary-200',
      text: 'text-text-primary',
      icon: HelpCircle,
      pulse: false,
    },
    online: {
      bg: 'bg-green-500',
      text: 'text-white',
      icon: CheckCircle,
      pulse: true,
    },
  };

  const config = configs[status] || configs.unknown;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${config.bg} ${config.text} px-4 py-2 rounded-full flex items-center gap-2 w-fit font-semibold text-sm shadow-lg backdrop-blur-sm ${
        config.pulse ? 'animate-pulse' : ''
      }`}
    >
      <Icon size={16} />
      <span className="capitalize">{status}</span>
    </motion.div>
  );
});

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  trend?: number;
  subtitle?: string;
}

export const StatsCard = memo(({ title, value, icon, color, trend, subtitle, onClick }: StatsCardProps & { onClick?: () => void }) => {
  const colorClasses = {
    blue: {
      gradient: 'bg-primary-200',
      glow: 'shadow-primary-200/20',
      icon: 'bg-primary-200/10 text-primary-400',
    },
    green: {
      gradient: 'bg-success',
      glow: 'shadow-success/20',
      icon: 'bg-success/10 text-success',
    },
    yellow: {
      gradient: 'bg-warning',
      glow: 'shadow-warning/20',
      icon: 'bg-warning/10 text-warning',
    },
    red: {
      gradient: 'bg-error',
      glow: 'shadow-error/20',
      icon: 'bg-error/10 text-error',
    },
    purple: {
      gradient: 'bg-primary-300',
      glow: 'shadow-primary-300/20',
      icon: 'bg-primary-300/10 text-primary-500',
    },
    indigo: {
      gradient: 'bg-primary-400',
      glow: 'shadow-primary-400/20',
      icon: 'bg-primary-400/10 text-primary-600',
    },
  };

  const config = colorClasses[color];


  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden bg-surface-primary rounded-2xl p-6 shadow-xl ${config.glow} hover:shadow-2xl transition-all duration-300 border border-border-primary`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* Gradient overlay */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-2xl`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-text-tertiary text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-text-secondary">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${trend >= 0 ? 'text-success' : 'text-error'}`}>
              {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <div className={`${config.icon} p-3 rounded-xl`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
});
