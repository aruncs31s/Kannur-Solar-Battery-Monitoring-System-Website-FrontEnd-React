import { AlertCircle, CheckCircle, AlertTriangle, Settings, XCircle, HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error' | 'maintenance' | 'decommissioned' | 'unknown';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const configs = {
    active: {
      bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      text: 'text-white',
      icon: CheckCircle,
      pulse: true,
    },
    inactive: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      text: 'text-white',
      icon: AlertTriangle,
      pulse: false,
    },
    error: {
      bg: 'bg-gradient-to-r from-red-500 to-pink-500',
      text: 'text-white',
      icon: AlertCircle,
      pulse: true,
    },
    maintenance: {
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      text: 'text-white',
      icon: Settings,
      pulse: false,
    },
    decommissioned: {
      bg: 'bg-gradient-to-r from-gray-400 to-gray-500',
      text: 'text-white',
      icon: XCircle,
      pulse: false,
    },
    unknown: {
      bg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
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
      gradient: 'from-blue-500 to-cyan-500',
      glow: 'shadow-blue-500/20',
      icon: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    green: {
      gradient: 'from-green-500 to-emerald-500',
      glow: 'shadow-green-500/20',
      icon: 'bg-green-500/10 text-green-600 dark:text-green-400',
    },
    yellow: {
      gradient: 'from-yellow-500 to-orange-500',
      glow: 'shadow-yellow-500/20',
      icon: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
    },
    red: {
      gradient: 'from-red-500 to-pink-500',
      glow: 'shadow-red-500/20',
      icon: 'bg-red-500/10 text-red-600 dark:text-red-400',
    },
    purple: {
      gradient: 'from-purple-500 to-pink-500',
      glow: 'shadow-purple-500/20',
      icon: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
    indigo: {
      gradient: 'from-indigo-500 to-purple-500',
      glow: 'shadow-indigo-500/20',
      icon: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
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
