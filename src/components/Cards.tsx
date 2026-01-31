import { AlertCircle, CheckCircle, AlertTriangle, Settings, XCircle, HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error' | 'maintenance' | 'decommissioned' | 'unknown';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const configs = {
    active: {
      bg: 'bg-gradient-to-r from-success to-nord-14',
      text: 'text-white',
      icon: CheckCircle,
      pulse: true,
    },
    inactive: {
      bg: 'bg-gradient-to-r from-warning to-nord-13',
      text: 'text-white',
      icon: AlertTriangle,
      pulse: false,
    },
    error: {
      bg: 'bg-gradient-to-r from-error to-nord-11',
      text: 'text-white',
      icon: AlertCircle,
      pulse: true,
    },
    maintenance: {
      bg: 'bg-gradient-to-r from-nord-8 to-nord-7',
      text: 'text-white',
      icon: Settings,
      pulse: false,
    },
    decommissioned: {
      bg: 'bg-gradient-to-r from-nord-3 to-nord-2',
      text: 'text-nord-0',
      icon: XCircle,
      pulse: false,
    },
    unknown: {
      bg: 'bg-gradient-to-r from-nord-15 to-nord-9',
      text: 'text-white',
      icon: HelpCircle,
      pulse: false,
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
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  trend?: number;
  subtitle?: string;
}

export const StatsCard = ({ title, value, icon, color, trend, subtitle }: StatsCardProps) => {
  const colorClasses = {
    blue: {
      gradient: 'from-nord-9 to-nord-8',
      glow: 'shadow-nord-9/20',
      icon: 'bg-nord-9/10 text-nord-9',
    },
    green: {
      gradient: 'from-success to-nord-14',
      glow: 'shadow-success/20',
      icon: 'bg-success/10 text-success',
    },
    yellow: {
      gradient: 'from-warning to-nord-13',
      glow: 'shadow-warning/20',
      icon: 'bg-warning/10 text-warning',
    },
    red: {
      gradient: 'from-error to-nord-11',
      glow: 'shadow-error/20',
      icon: 'bg-error/10 text-error',
    },
    purple: {
      gradient: 'from-nord-15 to-nord-9',
      glow: 'shadow-nord-15/20',
      icon: 'bg-nord-15/10 text-nord-15',
    },
    indigo: {
      gradient: 'from-nord-10 to-nord-9',
      glow: 'shadow-nord-10/20',
      icon: 'bg-nord-10/10 text-nord-10',
    },
  };

  const config = colorClasses[color];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl ${config.glow} hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700`}
    >
      {/* Gradient overlay */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-2xl`} />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
};
