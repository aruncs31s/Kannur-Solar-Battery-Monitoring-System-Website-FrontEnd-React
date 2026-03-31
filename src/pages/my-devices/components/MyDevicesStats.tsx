import { Battery, CheckCircle, Package, Zap } from "lucide-react";
import { StatsCard } from "../../../components/Cards";
import { MyDevicesStats as MyDevicesStatsModel } from "../hooks/useMyDevicesData";

interface MyDevicesStatsProps {
  stats: MyDevicesStatsModel;
}

export const MyDevicesStats = ({ stats }: MyDevicesStatsProps) => {
  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Solar Devices"
          value={stats.totalDevices}
          icon={<Package size={28} />}
          color="blue"
          subtitle="Solar chargers connected"
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
          title="Avg Battery Voltage"
          value={`${stats.averageVoltage.toFixed(1)}V`}
          icon={<Zap size={28} />}
          color="purple"
          subtitle="Average across devices"
        />
        <StatsCard
          title="Total Power"
          value={`${stats.totalPower.toFixed(1)}W`}
          icon={<Battery size={28} />}
          color="indigo"
          subtitle="Current output"
        />
      </div>
    </div>
  );
};
