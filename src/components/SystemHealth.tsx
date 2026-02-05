import { Activity, Settings } from 'lucide-react';

interface SystemHealthProps {
  stats: {
    activeDevices: number;
    totalDevices: number;
  };
}

export const SystemHealth = ({ stats }: SystemHealthProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-surface-primary border border-border-primary rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="text-success" size={24} />
          <h3 className="text-lg font-semibold text-text-primary">System Health</h3>
        </div>
        <div className="space-y-2 text-sm text-text-secondary">
          <p>
            • {Math.round((stats.activeDevices / (stats.totalDevices || 1)) * 100)}% devices
            operational
          </p>
          <p>• API connection active</p>
          <p>• Database synchronized</p>
        </div>
      </div>

      <div className="bg-surface-primary border border-border-primary rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="text-primary-500" size={24} />
          <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
        </div>
        <div className="space-y-2">
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded font-medium transition-colors text-sm">
            Export Data
          </button>
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded font-medium transition-colors text-sm">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};