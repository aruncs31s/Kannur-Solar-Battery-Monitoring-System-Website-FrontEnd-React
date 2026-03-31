import { Battery, CheckCircle, Package, Zap } from 'lucide-react';

import { StatsCard } from '../../../components/Cards';
import { DashboardStats as DashboardStatsModel } from '../hooks/useDashboardData';

interface DashboardStatsProps {
  stats: DashboardStatsModel;
  onViewDevices: () => void;
}

export const DashboardStats = ({ stats, onViewDevices }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Devices"
        value={stats.totalDevices}
        icon={<Package size={28} />}
        color="blue"
        subtitle="Connected devices"
        onClick={onViewDevices}
      />
      <StatsCard
        title="Active Devices"
        value={stats.activeDevices}
        icon={<CheckCircle size={28} />}
        color="green"
        subtitle="Currently online"
        trend={stats.activeDevices > 0 ? 5 : 0}
      />
      <StatsCard
        title="Avg Voltage"
        value={`${stats.avgVoltage.toFixed(2)}V`}
        icon={<Zap size={28} />}
        color="purple"
        subtitle="System average"
      />
      <StatsCard
        title="Total Power"
        value={`${stats.totalPower.toFixed(2)}W`}
        icon={<Battery size={28} />}
        color="indigo"
        subtitle="Current output"
      />
    </div>
  );
};
