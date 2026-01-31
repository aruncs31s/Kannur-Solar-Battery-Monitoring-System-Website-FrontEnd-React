import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { StatusBadge } from '../components/Cards';
import { Trash2, Plus, ExternalLink } from 'lucide-react';
import { FormField, FormError, FormSuccess } from '../components/FormComponents';

export const Devices = () => {
  const { devices, setDevices } = useDevicesStore();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    mac: '',
    installedLocation: '',
    status: 'active' as const,
    installedBy: '',
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await devicesAPI.getAllDevices();
      setDevices(response);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch devices');
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

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.mac || !formData.installedLocation) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const newDevice = await devicesAPI.createDevice(formData);
      setDevices([...devices, newDevice]);
      setSuccess('Device added successfully');
      setFormData({
        name: '',
        mac: '',
        installedLocation: '',
        status: 'active',
        installedBy: '',
      });
      setShowForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add device');
    }
  };

  const handleDeleteDevice = async (_id: number) => {
    // Device deletion is not yet implemented in the backend
    // This will be enabled once the backend supports device deletion
    setError('Device deletion is not yet available. This feature will be added in a future update.');
    setTimeout(() => setError(''), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading devices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Devices</h1>
          <p className="text-gray-600 mt-2">Manage and monitor your ESP32 devices</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Device
        </button>
      </div>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      {/* Add Device Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Device</h2>
          <form onSubmit={handleAddDevice} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Device Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="ESP001"
                required
              />
              <FormField
                label="MAC Address"
                name="mac"
                value={formData.mac}
                onChange={handleInputChange}
                placeholder="AA:BB:CC:DD:EE:FF"
                required
              />
              <FormField
                label="Installed Location"
                name="installedLocation"
                value={formData.installedLocation}
                onChange={handleInputChange}
                placeholder="Roof Panel 1"
                required
              />
              <FormField
                label="Installed By"
                name="installedBy"
                value={formData.installedBy}
                onChange={handleInputChange}
                placeholder="Technician Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="error">Error</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add Device
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Devices List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{device.name}</h3>
                <p className="text-sm text-gray-600 font-mono">{device.mac}</p>
              </div>
              <StatusBadge status={device.status} />
            </div>

            <div className="space-y-2 text-gray-700 mb-6">
              <p>
                <span className="font-semibold">Location:</span> {device.installedLocation || 'Not specified'}
              </p>
              <p>
                <span className="font-semibold">Installed By:</span> {device.installedBy}
              </p>
              {device.createdAt && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Added:</span>{' '}
                  {new Date(device.createdAt * 1000).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Link
                to={`/devices/${device.id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink size={18} />
                View Details
              </Link>
              <button
                onClick={() => handleDeleteDevice(device.id)}
                disabled
                className="bg-gray-400 text-gray-600 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                title="Device deletion is not yet implemented in the backend"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && !showForm && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">No devices found.</p>
          <p className="text-gray-500 mt-2">Click "Add Device" to register your first ESP32.</p>
        </div>
      )}
    </div>
  );
};
