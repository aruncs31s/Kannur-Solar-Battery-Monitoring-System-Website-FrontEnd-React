import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'error';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const configs = {
    active: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      icon: CheckCircle,
    },
    inactive: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: AlertTriangle,
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: AlertCircle,
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.text} px-3 py-1 rounded-full flex items-center gap-2 w-fit font-medium text-sm`}>
      <Icon size={16} />
      <span className="capitalize">{status}</span>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'yellow' | 'red';
}

export const StatsCard = ({ title, value, icon, color }: StatsCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6 flex items-center gap-4`}>
      <div>{icon}</div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};
