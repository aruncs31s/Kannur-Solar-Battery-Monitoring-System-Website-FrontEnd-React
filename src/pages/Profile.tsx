import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { FormError } from '../components/FormComponents';
import { 
  User, 
  Activity, 
  HardDrive, 
  MapPin, 
  Wifi, 
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { devicesAPI } from '../api/devices';
import { auditAPI } from '../api/audit';
import { DeviceResponseDTO } from '../domain/entities/Device';
import { AuditLog } from '../domain/entities/AuditLog';
import { Link } from 'react-router-dom';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';

export const Profile = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState<DeviceResponseDTO[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'activity'>('overview');
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch user's devices
        setDevicesLoading(true);
        const allDevices = await devicesAPI.getAllDevices();
        setDevices(allDevices);
        setDevicesLoading(false);

        // Fetch user's recent activity
        setActivityLoading(true);
        const allAuditLogs = await auditAPI.getAll();
        // Filter activities for current user
        const userActivities = allAuditLogs
          .filter(log => log.userId === user.id)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10); // Get last 10 activities
        setRecentActivity(userActivities);
        setActivityLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  const getDeviceStatusIcon = (state: number) => {
    switch (state) {
      case 1:
        return <CheckCircle className="text-success-500" size={20} />;
      case 0:
        return <XCircle className="text-error-500" size={20} />;
      default:
        return <AlertCircle className="text-warning-500" size={20} />;
    }
  };

  const getDeviceStatusText = (state: number) => {
    switch (state) {
      case 1:
        return 'Active';
      case 0:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getActivityColor = (action: string) => {
    if (action.includes('login')) return 'text-info-600';
    if (action.includes('create')) return 'text-success-600';
    if (action.includes('delete')) return 'text-error-600';
    if (action.includes('update')) return 'text-warning-600';
    return 'text-text-secondary';
  };

  const stats = {
    totalDevices: devices.length,
    activeDevices: devices.filter(d => d.device_state === 1).length,
    inactiveDevices: devices.filter(d => d.device_state === 0).length,
    totalActivities: recentActivity.length,
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <PageHeader 
        title="User Profile"
        description="View your account information, devices, and activity"
      />

      {error && <FormError message={error} />}

      {/* User Info Card */}
      <div className="bg-surface-primary rounded-lg shadow-md p-8">
        {loading ? (
          <LoadingState message="Loading profile..." minHeight="py-12" />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-4 rounded-full">
                <User className="text-primary-500" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{user?.name || user?.username}</h2>
                <p className="text-text-secondary">{user?.email || 'No email provided'}</p>
                {user?.role && (
                  <span className="inline-block mt-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {user.role}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-border-primary">
              <div className="bg-info-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-info-700 mb-1">
                  <HardDrive size={20} />
                  <span className="text-sm font-medium">Total Devices</span>
                </div>
                <p className="text-2xl font-bold text-info-900">{stats.totalDevices}</p>
              </div>
              <div className="bg-success-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-success-700 mb-1">
                  <CheckCircle size={20} />
                  <span className="text-sm font-medium">Active Devices</span>
                </div>
                <p className="text-2xl font-bold text-success-900">{stats.activeDevices}</p>
              </div>
              <div className="bg-error-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-error-700 mb-1">
                  <XCircle size={20} />
                  <span className="text-sm font-medium">Inactive Devices</span>
                </div>
                <p className="text-2xl font-bold text-error-900">{stats.inactiveDevices}</p>
              </div>
              <div className="bg-warning-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-warning-700 mb-1">
                  <Activity size={20} />
                  <span className="text-sm font-medium">Recent Activities</span>
                </div>
                <p className="text-2xl font-bold text-warning-900">{stats.totalActivities}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-surface-primary rounded-lg shadow-md">
        <div className="border-b border-border-primary">
          <nav className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <User size={18} />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`py-4 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'devices'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <HardDrive size={18} />
                My Devices ({devices.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity size={18} />
                Activity
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Username
                    </label>
                    <p className="text-lg text-text-primary">{user?.username}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Full Name
                    </label>
                    <p className="text-lg text-text-primary">{user?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Email Address
                    </label>
                    <p className="text-lg text-text-primary">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Role
                    </label>
                    <p className="text-lg text-text-primary capitalize">{user?.role || 'User'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      User ID
                    </label>
                    <p className="text-lg text-text-primary font-mono">{user?.id}</p>
                  </div>
                </div>
              </div>

              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <p className="text-sm text-warning-800">
                  <strong>Note:</strong> Profile editing is currently disabled as this feature is not yet implemented in the backend. Contact your administrator to update your account information.
                </p>
              </div>

              <div className="bg-info-50 border border-info-200 rounded-lg p-6">
                <h3 className="font-semibold text-info-900 mb-2">Security Tips</h3>
                <ul className="text-sm text-info-800 space-y-1">
                  <li>• Use a strong password with uppercase, lowercase, numbers, and symbols</li>
                  <li>• Change your password regularly</li>
                  <li>• Never share your login credentials with anyone</li>
                  <li>• Always log out when using shared computers</li>
                </ul>
              </div>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-text-primary">My Devices</h3>
                <Link
                  to="/devices"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View All Devices →
                </Link>
              </div>

              {devicesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : devices.length === 0 ? (
                <div className="text-center py-12">
                  <HardDrive className="mx-auto text-text-secondary mb-4" size={48} />
                  <p className="text-text-secondary">No devices found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {devices.map((device) => (
                    <Link
                      key={device.id}
                      to={`/devices/${device.id}`}
                      className="bg-surface-secondary border border-border-primary rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <HardDrive className="text-primary-500" size={20} />
                          <h4 className="font-semibold text-text-primary">{device.name}</h4>
                        </div>
                        {getDeviceStatusIcon(device.device_state)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-text-secondary">
                          <span className="font-medium">Status:</span>
                          <span className={device.device_state === 1 ? 'text-success-600' : 'text-error-600'}>
                            {getDeviceStatusText(device.device_state)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <MapPin size={14} />
                          <span>{device.city}, {device.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-text-secondary">
                          <Wifi size={14} />
                          <span>{device.ip_address}</span>
                        </div>
                        <div className="text-text-secondary">
                          <span className="font-medium">Type:</span> {device.type}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-text-primary">Recent Activity</h3>
                <Link
                  to="/audit"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View All Activity →
                </Link>
              </div>

              {activityLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="mx-auto text-text-secondary mb-4" size={48} />
                  <p className="text-text-secondary">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-surface-secondary border border-border-primary rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Activity className={getActivityColor(activity.action)} size={20} />
                          <div className="flex-1">
                            <p className="font-medium text-text-primary">{activity.action}</p>
                            <p className="text-sm text-text-secondary mt-1">{activity.details}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{formatTimestamp(activity.timestamp)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Wifi size={12} />
                                <span>{activity.ipAddress}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
