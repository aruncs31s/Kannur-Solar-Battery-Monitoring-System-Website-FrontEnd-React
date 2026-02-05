import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { usersAPI } from '../api/users';
import { StatsCard } from '../components/Cards';
import {
  Package,
  Activity,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  Cpu,
  Database,
  UserCheck,
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-text-primary">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/devices"
            className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-text-tertiary text-sm font-medium mb-2">Device Management</p>
                <p className="text-2xl font-bold text-text-primary mb-1">Manage Devices</p>
                <p className="text-xs text-text-secondary">Monitor and control all system devices</p>
              </div>
              <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <Database size={32} />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/users"
            className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-text-tertiary text-sm font-medium mb-2">User Management</p>
                <p className="text-2xl font-bold text-text-primary mb-1">Manage Users</p>
                <p className="text-xs text-text-secondary">Control user accounts and permissions</p>
              </div>
              <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <UserCheck size={32} />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/device-types"
            className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-text-tertiary text-sm font-medium mb-2">Device Type Management</p>
                <p className="text-2xl font-bold text-text-primary mb-1">Manage Types</p>
                <p className="text-xs text-text-secondary">Configure device types and hardware</p>
              </div>
              <div className="bg-green-500/10 text-green-500 p-3 rounded-xl group-hover:bg-green-500/20 transition-colors">
                <Cpu size={32} />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* System Health */}
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
    </div>
  );
};
