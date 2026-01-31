import { useEffect, useState } from 'react';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { usersAPI } from '../api/users';
import { User, CreateUserDTO } from '../domain/entities/User';
import { StatsCard, StatusBadge } from '../components/Cards';
import {
  Package,
  Activity,
  Settings,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Users,
  UserPlus,
  Trash2,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Admin = () => {
  const { devices, setDevices, setLoading, setError } = useDevicesStore();
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

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
      setUsers(usersResponse);

      // Calculate statistics
      const active = devicesResponse.filter((d) => d.device_state === 1).length;
      const inactive = devicesResponse.filter((d) => d.device_state === 2).length;
      const error = devicesResponse.filter((d) => d.device_state === 3).length;

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      UserCredentials: {
        username: newUser.username,
        password: newUser.password
      },
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
    console.log('Submitting user data:', userData);
    try {
      await usersAPI.create(userData);
      setNewUser({ name: '', username: '', email: '', password: '', role: 'user' });
      setShowAddUser(false);
      fetchAdminData();
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(parseInt(userId));
        fetchAdminData();
      } catch (err) {
        setError('Failed to delete user');
      }
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
          <h2 className="text-2xl font-bold text-text-primary">Device Management</h2>
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

      {/* User Management */}
      <div className="bg-surface-primary rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-border-primary flex justify-between items-center">
          <h2 className="text-2xl font-bold text-text-primary">User Management</h2>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-primary-500 hover:bg-primary-600 text-text-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <UserPlus size={20} />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-secondary border-b border-border-primary">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border-primary hover:bg-surface-secondary transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto text-text-tertiary mb-2" size={48} />
            <p className="text-text-secondary">No users found</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-primary rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-text-primary mb-4">Add New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-text-primary rounded-lg font-medium transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
