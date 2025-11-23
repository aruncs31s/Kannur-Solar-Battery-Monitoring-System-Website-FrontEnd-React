import { useEffect, useState } from 'react';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { StatsCard, StatusBadge } from '../components/Cards';
import {
  Package,
  Activity,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Admin = () => {
  const { devices, setDevices, setLoading, setError } = useDevicesStore();
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    errorDevices: 0,
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const response = await devicesAPI.getAllDevices();
      setDevices(response);

      // Calculate statistics
      const active = response.filter((d) => d.status === 'active').length;
      const inactive = response.filter((d) => d.status === 'inactive').length;
      const error = response.filter((d) => d.status === 'error').length;

      setStats({
        totalDevices: response.length,
        activeDevices: active,
        inactiveDevices: inactive,
        errorDevices: error,
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch admin data');
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
          <h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-600 mt-2">System management and monitoring</p>
        </div>
        <button
          onClick={fetchAdminData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Activity size={20} />
          Refresh
        </button>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      {/* Device Status Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Device Status Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Active" fill="#10b981" />
            <Bar dataKey="Inactive" fill="#f59e0b" />
            <Bar dataKey="Error" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Device Management Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Device Management</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  MAC Address
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Location
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Installed By
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                  Created
                </th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr
                  key={device.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {device.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {device.mac}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {device.installedLocation || 'Not specified'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {device.installedBy}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(device.createdAt * 1000).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {devices.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">No devices found</p>
          </div>
        )}
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-green-900">System Health</h3>
          </div>
          <div className="space-y-2 text-sm text-green-800">
            <p>
              • {Math.round((stats.activeDevices / (stats.totalDevices || 1)) * 100)}% devices
              operational
            </p>
            <p>• API connection active</p>
            <p>• Database synchronized</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-blue-900">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm">
              Export Data
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors text-sm">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
