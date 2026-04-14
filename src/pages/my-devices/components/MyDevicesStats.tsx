import { Cpu, Package, Sun, Waves } from "lucide-react";
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
          title="Total Devices"
          value={stats.totalDevices}
          icon={<Package size={28} />}
          color="blue"
          subtitle="All assigned devices"
        />
        <StatsCard
          title="Solar Devices"
          value={stats.solarDevices}
          icon={<Sun size={28} />}
          color="green"
          subtitle="Solar monitoring units"
        />
        <StatsCard
          title="Sensors"
          value={stats.sensorDevices}
          icon={<Waves size={28} />}
          color="yellow"
          subtitle="Sensor category devices"
        />
        <StatsCard
          title="Microcontrollers"
          value={stats.microcontrollers}
          icon={<Cpu size={28} />}
          color="indigo"
          subtitle="Controllers and gateways"
        />
      </div>
    </div>
  );
};
