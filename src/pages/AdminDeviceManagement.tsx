import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { StatusBadge } from '../components/Cards';
import {
  Package,
  Activity,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AdminDeviceManagement = () => {
  const { devices, setDevices, setLoading, setError } = useDevicesStore();
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    errorDevices: 0,
  });

  useEffect(() => {
    fetchDeviceData();
  }, []);

  const fetchDeviceData = async () => {
    setLoading(true);
    try {
      const devicesResponse = await devicesAPI.getAllDevices();
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
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch device data');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    {
      name: 'Devices',
      Active: stats.activeDevices,
      Inactive: stats.inactiveDevices,
      Error: stats.errorDevices,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-text-primary">Device Management</h1>
          <p className="text-text-secondary mt-2">Monitor and manage all system devices</p>
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
            onClick={fetchDeviceData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Activity size={20} />
            Refresh
          </button>
        </div>
      </div>

      {/* Device Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Total Devices</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.totalDevices}</p>
              <p className="text-xs text-text-secondary">All registered devices</p>
            </div>
            <div className="bg-blue-200/10 text-blue-400 p-3 rounded-xl">
              <Package size={32} />
            </div>
          </div>
        </div>
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Active Devices</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.activeDevices}</p>
              <p className="text-xs text-text-secondary">Currently online</p>
            </div>
            <div className="bg-green-500/10 text-green-500 p-3 rounded-xl">
              <Activity size={32} />
            </div>
          </div>
        </div>
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Inactive Devices</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.inactiveDevices}</p>
              <p className="text-xs text-text-secondary">Offline devices</p>
            </div>
            <div className="bg-yellow-500/10 text-yellow-500 p-3 rounded-xl">
              <Settings size={32} />
            </div>
          </div>
        </div>
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Error Devices</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{stats.errorDevices}</p>
              <p className="text-xs text-text-secondary">Devices with issues</p>
            </div>
            <div className="bg-red-500/10 text-red-500 p-3 rounded-xl">
              <Settings size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Device Status Chart */}
      <div className="bg-surface-primary rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Device Status Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
            <XAxis dataKey="name" stroke="var(--text-tertiary)" />
            <YAxis stroke="var(--text-tertiary)" />
            <Tooltip contentStyle={{ backgroundColor: 'var(--surface-primary)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: 'var(--text-primary)' }} />
            <Legend />
            <Bar dataKey="Active" fill="var(--success)" />
            <Bar dataKey="Inactive" fill="var(--warning)" />
            <Bar dataKey="Error" fill="var(--error)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Device Management Table */}
      <div className="bg-surface-primary rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary">All Devices</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-secondary border-b border-border-primary">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  MAC Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr
                  key={device.id}
                  className="border-b border-border-primary hover:bg-surface-secondary transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {device.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary font-mono">
                    {device.mac_address}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {device.address || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {device.type}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={device.device_state === 1 ? 'active' : device.device_state === 2 ? 'inactive' : 'unknown'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {devices.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-text-tertiary mb-2" size={48} />
            <p className="text-text-secondary">No devices found</p>
          </div>
        )}
      </div>
    </div>
  );
};