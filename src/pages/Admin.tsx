import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { usersAPI } from '../api/users';
import { StatsCard } from '../components/Cards';
import { SystemHealth } from '../components/SystemHealth';
import { ManagementModules } from '../components/ManagementModules';
import {
  Package,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Settings,
  Activity,
} from 'lucide-react';

export const Admin = () => {
  const { setDevices, setLoading, setError } = useDevicesStore();
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    errorDevices: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [devicesResponse, usersResponse] = await Promise.all([
        devicesAPI.getAllDevices(),
        usersAPI.getAll()
      ]);

      setDevices(devicesResponse);

      // Calculate statistics
      const active = devicesResponse.filter((d: any) => d.device_state === 1).length;
      const inactive = devicesResponse.filter((d: any) => d.device_state === 2).length;
      const error = devicesResponse.filter((d: any) => d.device_state === 3).length;

      setStats({
        totalDevices: devicesResponse.length,
        activeDevices: active,
        inactiveDevices: inactive,
        errorDevices: error,
        totalUsers: usersResponse.length,
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

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
        />
        <StatsCard
          title="Active"
          value={stats.activeDevices}
          icon={<CheckCircle size={32} />}
          color="green"
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
