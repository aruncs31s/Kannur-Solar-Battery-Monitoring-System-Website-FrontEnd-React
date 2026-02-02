import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { devicesAPI } from '../api/devices';
import { DeviceResponseDTO } from '../domain/entities/Device';
import { FormError, FormField } from '../components/FormComponents';
import {
  HardDrive,
  Activity,
  MapPin,
  Wifi,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Battery,
  Zap,
  Plus,
  X
} from 'lucide-react';

export const MyDevices = () => {
  const [devices, setDevices] = useState<DeviceResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    uid: '',
    type: 1,
    ip_address: '',
    mac_address: '',
    firmware_version_id: 1,
    address: '',
    city: '',
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [tokenMessages, setTokenMessages] = useState<{[key: number]: string}>({});
  const [generatedTokens, setGeneratedTokens] = useState<{[key: number]: string}>({});
  // const [selectedDevice, setSelectedDevice] = useState<DeviceResponseDTO | null>(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await devicesAPI.getMyDevices();
      setDevices(response);
      setError('');
    } catch (err: any) {
      console.log('Error fetching devices:', err);
      setError('Failed to load your devices');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!formData.name || !formData.uid) {
      setCreateError('Please fill in the device name and UID');
      return;
    }

    setCreateLoading(true);
    try {
      const newDevice = await devicesAPI.createDevice(formData);
      setDevices([...devices, newDevice]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        uid: '',
        type: 1,
        ip_address: '',
        mac_address: '',
        firmware_version_id: 1,
        address: '',
        city: '',
      });
      // Refresh devices to get the latest data
      fetchDevices();
    } catch (err: any) {
      setCreateError(err.response?.data?.error || 'Failed to create device');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleGenerateToken = async (deviceId: number) => {
    setTokenMessages(prev => ({ ...prev, [deviceId]: '' }));
    setGeneratedTokens(prev => ({ ...prev, [deviceId]: '' }));

    try {
      const response = await devicesAPI.generateDeviceToken(deviceId);
      setGeneratedTokens(prev => ({ ...prev, [deviceId]: response.token }));
      setTokenMessages(prev => ({ ...prev, [deviceId]: 'Token generated successfully!' }));
      setTimeout(() => {
        setTokenMessages(prev => ({ ...prev, [deviceId]: '' }));
      }, 5000);
    } catch (err: any) {
      setTokenMessages(prev => ({ ...prev, [deviceId]: 'Failed to generate token' }));
      console.error('Token generation error:', err);
    }
  };

  const getDeviceStatusText = (state: number) => {
    switch (state) {
      case 1:
        return 'Online';
      case 0:
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const getDeviceStatusColor = (state: number) => {
    switch (state) {
      case 1:
        return 'text-success-600 bg-success-50 border-success-200';
      case 0:
        return 'text-error-600 bg-error-50 border-error-200';
      default:
        return 'text-warning-600 bg-warning-50 border-warning-200';
    }
  };

  const stats = {
    totalDevices: devices.length,
    onlineDevices: devices.filter(d => d.device_state === 1).length,
    offlineDevices: devices.filter(d => d.device_state === 0).length,
    totalCapacity: devices.length * 100, // Assuming 100kW per device for demo
    activeCapacity: devices.filter(d => d.device_state === 1).length * 100,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-text-primary">My Devices</h1>
          <p className="text-text-secondary mt-2">Monitor and manage your solar battery monitoring devices</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Device
        </button>
      </div>

      {error && <FormError message={error} />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-primary rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary-100 p-3 rounded-full">
              <HardDrive className="text-primary-500" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Devices</p>
              <p className="text-3xl font-bold text-text-primary">{stats.totalDevices}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="text-success-500" size={16} />
            <span className="text-success-600">All systems operational</span>
          </div>
        </div>

        <div className="bg-surface-primary rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-success-100 p-3 rounded-full">
              <CheckCircle className="text-success-500" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Online Devices</p>
              <p className="text-3xl font-bold text-text-primary">{stats.onlineDevices}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-full bg-surface-secondary rounded-full h-2">
              <div
                className="bg-success-500 h-2 rounded-full"
                style={{ width: `${stats.totalDevices > 0 ? (stats.onlineDevices / stats.totalDevices) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-surface-primary rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-error-100 p-3 rounded-full">
              <XCircle className="text-error-500" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Offline Devices</p>
              <p className="text-3xl font-bold text-text-primary">{stats.offlineDevices}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-full bg-surface-secondary rounded-full h-2">
              <div
                className="bg-error-500 h-2 rounded-full"
                style={{ width: `${stats.totalDevices > 0 ? (stats.offlineDevices / stats.totalDevices) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-surface-primary rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-warning-100 p-3 rounded-full">
              <Battery className="text-warning-500" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Capacity</p>
              <p className="text-3xl font-bold text-text-primary">{stats.totalCapacity}kW</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="text-warning-500" size={16} />
            <span className="text-warning-600">{stats.activeCapacity}kW active</span>
          </div>
        </div>
      </div>

      {/* Devices Grid */}
      {!devices || devices.length === 0 ? (
        <div className="bg-surface-primary rounded-lg shadow-md p-12 text-center">
          <HardDrive className="mx-auto text-text-secondary mb-4" size={64} />
          <h3 className="text-xl font-semibold text-text-primary mb-2">No Devices Found</h3>
          <p className="text-text-secondary mb-6">you have no devices add one</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Your First Device
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div
              key={device.id}
              className="bg-surface-primary rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-border-primary"
            >
              {/* Device Header */}
              <div className="p-6 border-b border-border-primary">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-lg">
                      <HardDrive className="text-primary-500" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary">{device.name}</h3>
                      <p className="text-sm text-text-secondary font-mono">{device.mac_address}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getDeviceStatusColor(device.device_state)}`}>
                    {getDeviceStatusText(device.device_state)}
                  </div>
                </div>

                {/* Device Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="text-text-secondary" size={16} />
                    <span className="text-text-primary">{device.city}, {device.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="text-text-secondary" size={16} />
                    <span className="text-text-primary">{device.ip_address || 'No IP assigned'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="text-text-secondary" size={16} />
                    <span className="text-text-primary">Type: {device.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="text-text-secondary" size={16} />
                    <span className="text-text-primary">Firmware: {device.firmware_version}</span>
                  </div>
                </div>
              </div>

              {/* Device Actions */}
              <div className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Link
                      to={`/devices/${device.id}`}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Eye size={18} />
                      View Details
                    </Link>
                    <Link
                      to={`/devices/${device.id}/history`}
                      className="flex-1 bg-surface-secondary hover:bg-surface-tertiary text-text-primary px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-border-primary"
                    >
                      <Activity size={18} />
                      Readings
                    </Link>
                  </div>
                  
                  <button
                    onClick={() => handleGenerateToken(device.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    Generate Token
                  </button>
                  
                  {tokenMessages[device.id] && (
                    <div className={`p-3 rounded-lg text-sm ${tokenMessages[device.id].includes('success') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {tokenMessages[device.id]}
                      {generatedTokens[device.id] && (
                        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs break-all">
                          {generatedTokens[device.id]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-surface-primary rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/map"
            className="bg-info-50 hover:bg-info-100 border border-info-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="text-info-500" size={24} />
              <div>
                <h4 className="font-semibold text-info-900">View on Map</h4>
                <p className="text-sm text-info-700">See all device locations</p>
              </div>
            </div>
          </Link>

          <Link
            to="/readings"
            className="bg-success-50 hover:bg-success-100 border border-success-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Activity className="text-success-500" size={24} />
              <div>
                <h4 className="font-semibold text-success-900">All Readings</h4>
                <p className="text-sm text-success-700">View system performance</p>
              </div>
            </div>
          </Link>

          <Link
            to="/audit"
            className="bg-warning-50 hover:bg-warning-100 border border-warning-200 rounded-lg p-4 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Clock className="text-warning-500" size={24} />
              <div>
                <h4 className="font-semibold text-warning-900">Activity Log</h4>
                <p className="text-sm text-warning-700">Monitor system activity</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Create Device Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-border-primary">
              <h3 className="text-xl font-bold text-text-primary">Add New Device</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateDevice} className="p-6 space-y-4">
              {createError && <FormError message={createError} />}

              <FormField
                label="Device Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Solar Monitor 1"
                required
              />

              <FormField
                label="UID"
                name="uid"
                type="text"
                value={formData.uid}
                onChange={handleInputChange}
                placeholder="unique-device-id"
                required
              />

              <FormField
                label="MAC Address"
                name="mac_address"
                type="text"
                value={formData.mac_address}
                onChange={handleInputChange}
                placeholder="AA:BB:CC:DD:EE:FF"
              />

              <FormField
                label="IP Address"
                name="ip_address"
                type="text"
                value={formData.ip_address}
                onChange={handleInputChange}
                placeholder="192.168.1.100"
              />

              <FormField
                label="Address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street"
              />

              <FormField
                label="City"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Kannur"
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Device Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value={1}>Sensor</option>
                  <option value={2}>Actuator</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-secondary disabled:text-text-secondary text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {createLoading ? 'Creating...' : 'Create Device'}
                  {!createLoading && <Plus size={20} />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 border border-border-primary rounded-lg font-medium text-text-primary hover:bg-surface-secondary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};