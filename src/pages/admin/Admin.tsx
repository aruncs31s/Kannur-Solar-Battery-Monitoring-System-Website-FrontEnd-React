import { Link, useNavigate } from 'react-router-dom';
import { StatsCard } from '../../components/Cards';
import { SystemHealth } from '../../components/SystemHealth';
import { ManagementModules } from '../../components/ManagementModules';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Settings,
  Activity,
} from 'lucide-react';
import { useAdminData } from './hooks/useAdminData';

export const Admin = () => {
  const navigate = useNavigate();
  const { stats, fetchAdminData } = useAdminData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-text-primary">Admin Panel</h1>
          <p className="text-text-secondary mt-2">System management and monitoring</p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/versions"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Settings size={20} />
            Versions
          </Link>
          <Link
            to="/configuration"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Settings size={20} />
            Configuration
          </Link>
          <button
            onClick={fetchAdminData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Activity size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard
          title="Total Devices"
          value={stats.totalDevices}
          icon={<Package size={32} />}
          color="blue"
          onClick={fetchAdminData}
        />
        <StatsCard
          title="Active"
          value={stats.activeDevices}
          icon={<CheckCircle size={32} />}
          color="green"
          onClick={() => navigate('/devices')}
        />
        <StatsCard
          title="Inactive"
          value={stats.inactiveDevices}
          icon={<AlertTriangle size={32} />}
          color="yellow"
        />
        <StatsCard
          title="Errors"
          value={stats.errorDevices}
          icon={<XCircle size={32} />}
          color="red"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={32} />}
          color="purple"
        />
      </div>

      {/* Management Modules */}
      <ManagementModules />

      {/* System Health */}
      <SystemHealth stats={stats} />
    </div>
  );
};
