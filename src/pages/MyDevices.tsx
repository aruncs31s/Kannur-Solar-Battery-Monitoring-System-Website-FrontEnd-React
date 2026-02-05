import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { devicesAPI } from '../api/devices';
import { DeviceResponseDTO } from '../domain/entities/Device';
import { useSearchStore } from '../store/searchStore';
import { AddSolarDeviceModal } from '../components/AddSolarDeviceModal';
import { AllDevicesSection } from '../components/AllDevicesSection';
import { StatsCard } from '../components/Cards';
import { FormError, FormField, FormSuccess } from '../components/FormComponents';
import {
  HardDrive,
  Activity,
  MapPin,
  Clock,
  CheckCircle,
  Battery,
  Zap,
  Package,
  Plus,
  X,
} from 'lucide-react';

export const MyDevices = () => {
  const [devices, setDevices] = useState<DeviceResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSolarModal, setShowSolarModal] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const { query: searchQuery } = useSearchStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 1,
    ip_address: '',
    mac_address: '',
    firmware_version_id: 1,
    address: '',
    city: '',
  });
  const [createError, setCreateError] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [success, setSuccess] = useState('');


  useEffect(() => {
    fetchDevices();
    fetchDeviceTypes();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

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

  const fetchDeviceTypes = async () => {
    try {
      const data = await devicesAPI.getDeviceTypes();
      setDeviceTypes(data);
    } catch (err) {
      console.error('Failed to fetch device types:', err);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const results = await devicesAPI.searchDevices(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'type' ? parseInt(value, 10) : value,
    }));
  };

  const handleCreateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!formData.name) {
      setCreateError('Please fill in the device name');
      return;
    }

    setCreateLoading(true);
    try {
      const newDevice = await devicesAPI.createDevice(formData);
      setDevices([...devices, newDevice]);
      setShowCreateModal(false);
      setFormData({
        name: '',
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

  const activeDevices = devices.filter((device) => device.device_state === 1).length;
  const avgVoltage = 0;
  const totalPower = 0;

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
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Device
          </button>
          <button
            onClick={() => setShowSolarModal(true)}
            className="bg-success hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Solar Device
          </button>
        </div>
      </div>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

       


      {/* Statistics Cards */}
      <div className="space-y-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Devices" value={devices.length} icon={<Package size={28} />} color="blue" subtitle="Connected devices" />
          <StatsCard title="Active Devices" value={activeDevices} icon={<CheckCircle size={28} />} color="green" subtitle="Currently online" trend={activeDevices > 0 ? 5 : 0} />
          <StatsCard title="Avg Voltage" value={`${avgVoltage}V`} icon={<Zap size={28} />} color="purple" subtitle="System average" />
          <StatsCard title="Total Power" value={`${totalPower}W`} icon={<Battery size={28} />} color="indigo" subtitle="Current output" />
        </div>
      </div>

      {/* Devices Grid */}
      {(() => {
        const displayDevices = searchQuery ? searchResults : devices;
        return !displayDevices || displayDevices.length === 0 ? (
          <div className="bg-surface-primary rounded-lg shadow-md p-12 text-center">
            <HardDrive className="mx-auto text-text-secondary mb-4" size={64} />
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {searchQuery ? 'No Devices Found' : 'No Devices Found'}
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery ? 'No devices match your search.' : 'you have no devices add one'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Add Your First Device
              </button>
            )}
          </div>
        ) : (
          <AllDevicesSection devices={displayDevices} showGenerateToken={true} title={searchQuery ? `Search Results for "${searchQuery}"` : "My Devices"} showViewAllLink={false} maxDevices={displayDevices.length} />
        );
      })()}

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary flex justify-between items-center">
              <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <Plus size={24} />
                Add New Device
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateDevice} className="p-6 space-y-6">
              {createError && <FormError message={createError} />}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Device Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface-secondary text-text-primary"
                    required
                  >
                    <option value="">Select device type</option>
                    {deviceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-secondary disabled:text-text-secondary text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  {createLoading ? 'Creating...' : 'Create Device'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Solar Device Modal */}
      <AddSolarDeviceModal
        isOpen={showSolarModal}
        onClose={() => setShowSolarModal(false)}
        onDeviceAdded={(device) => {
          setDevices([...devices, device]);
          fetchDevices();
        }}
        onError={setError}
        onSuccess={(message) => setSuccess(message)}
      />
    </div>
  );
};