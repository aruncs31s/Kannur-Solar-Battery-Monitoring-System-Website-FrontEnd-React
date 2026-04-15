import { Package, CheckCircle, Zap, Battery } from 'lucide-react';
import { StatsCard } from '../../../components/Cards';

interface DevicesStatsProps {
  totalDevices: number;
  activeDevicesCount: number;
  avgVoltage?: string;
  totalPower?: string;
}

export const DevicesStats = ({
  totalDevices,
  activeDevicesCount,
  avgVoltage = '0V',
  totalPower = '0W',
}: DevicesStatsProps) => {
  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Devices"
          value={totalDevices}
          icon={<Package size={28} />}
          color="blue"
          subtitle="Connected devices"
        />
        <StatsCard
          title="Active Devices"
          value={activeDevicesCount}
          icon={<CheckCircle size={28} />}
          color="green"
          subtitle="Currently online"
          trend={activeDevicesCount > 0 ? 5 : 0}
        />
        <StatsCard
          title="Avg Voltage"
          value={avgVoltage}
          icon={<Zap size={28} />}
          color="purple"
          subtitle="System average"
        />
        <StatsCard
          title="Total Power"
          value={totalPower}
          icon={<Battery size={28} />}
          color="indigo"
          subtitle="Current output"
        />
      </div>
    </div>
  );
};
