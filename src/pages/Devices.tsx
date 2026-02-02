import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { StatusBadge } from '../components/Cards';
import { Trash2, Plus, ExternalLink, Copy, Check, X, AlertCircle } from 'lucide-react';
import { FormField, FormError, FormSuccess } from '../components/FormComponents';

export const Devices = () => {
  const { devices, setDevices } = useDevicesStore();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [generatedToken, setGeneratedToken] = useState('');
  const [tokenCopied, setTokenCopied] = useState(false);
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

    if (!formData.name || !formData.uid) {
      setError('Please fill in the device name and UID');
      return;
    }

    try {
      const newDevice = await devicesAPI.createDevice(formData);
      setDevices([...devices, newDevice]);
      setSuccess('Device added successfully');
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

  const handleGenerateToken = async (deviceId: number) => {
    setSelectedDeviceId(deviceId);
    
    try {
      const response = await devicesAPI.generateDeviceToken(deviceId);
      setGeneratedToken(response.token);
      setShowTokenModal(true);
      setTokenCopied(false);
    } catch (err: any) {
      setError('Failed to generate token');
      setTimeout(() => setError(''), 3000);
      console.error('Token generation error:', err);
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(generatedToken);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setGeneratedToken('');
    setTokenCopied(false);
    setSelectedDeviceId(null);
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
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Device
        </button>
      </div>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary flex justify-between items-center">
              <h3 className="text-2xl font-bold text-text-primary">Device Authentication Token</h3>
              <button
                onClick={closeTokenModal}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">Important Security Information</p>
                    <p>This token grants access to device data and control. Keep it secure and do not share it publicly.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">JWT Token</label>
                <div className="relative">
                  <div className="bg-surface-secondary border border-border-primary rounded-lg p-4 font-mono text-sm break-all text-text-primary max-h-48 overflow-y-auto">
                    {generatedToken}
                  </div>
                  <button
                    onClick={copyToken}
                    className={`absolute top-2 right-2 px-3 py-1.5 rounded-md font-medium text-sm transition-all ${
                      tokenCopied
                        ? 'bg-success text-white'
                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                    }`}
                  >
                    {tokenCopied ? (
                      <span className="flex items-center gap-1">
                        <Check size={16} />
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy size={16} />
                        Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-text-primary">How to use this token:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                  <li>Copy the token using the button above</li>
                  <li>Use it in your API requests as a Bearer token</li>
                  <li>Include it in the Authorization header: <code className="bg-surface-secondary px-2 py-1 rounded text-xs">Bearer YOUR_TOKEN</code></li>
                  <li>The token contains your user ID and device ID for authentication</li>
                </ol>
              </div>
            </div>
            
            <div className="p-6 border-t border-border-primary flex justify-end gap-3">
              <button
                onClick={closeTokenModal}
                className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Device Form */}
      {showForm && (
        <div className="bg-surface-primary rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Add New Device</h2>
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
                label="UID"
                name="uid"
                value={formData.uid}
                onChange={handleInputChange}
                placeholder="unique-device-id"
                required
              />
              <FormField
                label="MAC Address"
                name="mac_address"
                value={formData.mac_address}
                onChange={handleInputChange}
                placeholder="AA:BB:CC:DD:EE:FF"
              />
              <FormField
                label="IP Address"
                name="ip_address"
                value={formData.ip_address}
                onChange={handleInputChange}
                placeholder="192.168.1.100"
              />
              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Roof Panel 1"
              />
              <FormField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Kannur"
              />
              <div>
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
                  <option value={1}>Sensor</option>
                  <option value={2}>Actuator</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-success hover:opacity-90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add Device
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-surface-secondary hover:bg-surface-tertiary text-text-primary px-6 py-2 rounded-lg font-medium transition-colors"
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
            className="bg-surface-primary rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{device.name}</h3>
                <p className="text-sm text-text-secondary font-mono">{device.mac_address}</p>
              </div>
              <StatusBadge status={device.device_state === 1 ? 'active' : device.device_state === 2 ? 'inactive' : 'unknown'} />
            </div>

            <div className="space-y-2 text-text-primary mb-6">
              <p>
                <span className="font-semibold">Type:</span> {device.type}
              </p>
              <p>
                <span className="font-semibold">Address:</span> {device.address || 'Not specified'}
              </p>
              <p>
                <span className="font-semibold">IP Address:</span> {device.ip_address || 'Not assigned'}
              </p>
              {device.city && (
                <p>
                  <span className="font-semibold">City:</span> {device.city}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Link
                  to={`/devices/${device.id}`}
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ExternalLink size={18} />
                  View Details
                </Link>
                <button
                  onClick={() => handleDeleteDevice(device.id)}
                  disabled
                  className="bg-surface-secondary text-text-secondary px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  title="Device deletion is not yet implemented in the backend"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <button
                onClick={() => handleGenerateToken(device.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                Generate Token
              </button>
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && !showForm && (
        <div className="bg-surface-primary rounded-lg shadow-md p-12 text-center">
          <p className="text-text-secondary text-lg">No devices found.</p>
          <p className="text-text-tertiary mt-2">Click "Add Device" to register your first ESP32.</p>
        </div>
      )}
    </div>
  );
};
