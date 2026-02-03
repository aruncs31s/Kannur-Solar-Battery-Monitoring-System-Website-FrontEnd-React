import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { StatusBadge } from '../components/Cards';
import { AddDeviceForm } from '../components/AddDeviceForm';
import { DeviceTokenModal } from '../components/DeviceTokenModal';
import { Trash2, ExternalLink, X, AlertCircle } from 'lucide-react';
import { FormError, FormSuccess } from '../components/FormComponents';

export const Devices = () => {
  const { devices, setDevices } = useDevicesStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);

  useEffect(() => {
    fetchDevices();
    fetchDeviceTypes();
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

  const fetchDeviceTypes = async () => {
    try {
      const deviceTypes = await devicesAPI.getDeviceTypes();
      setDeviceTypes(deviceTypes);
    } catch (err) {
      console.error('Failed to fetch device types:', err);
    }
  };

  const handleDeviceAdded = (newDevice: any) => {
    setDevices([...devices, newDevice]);
  };

  const handleDeleteDevice = async (_id: number) => {
    // Device deletion is not yet implemented in the backend
    // This will be enabled once the backend supports device deletion
    setError('Device deletion is not yet available. This feature will be added in a future update.');
    setTimeout(() => setError(''), 5000);
  };

  const handleGenerateToken = async (deviceId: number) => {
    try {
      const response = await devicesAPI.generateDeviceToken(deviceId);
      setGeneratedToken(response.token);
      setShowTokenModal(true);
    } catch (err: any) {
      setError('Failed to generate token');
      setTimeout(() => setError(''), 3000);
      console.error('Token generation error:', err);
    }
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setGeneratedToken('');
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
        <AddDeviceForm
          deviceTypes={deviceTypes}
          onDeviceAdded={handleDeviceAdded}
          onError={setError}
          onSuccess={setSuccess}
        />
      </div>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      <DeviceTokenModal
        isOpen={showTokenModal}
        token={generatedToken}
        onClose={closeTokenModal}
      />

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

      {devices.length === 0 && (
        <div className="bg-surface-primary rounded-lg shadow-md p-12 text-center">
          <p className="text-text-secondary text-lg">No devices found.</p>
          <p className="text-text-tertiary mt-2">Click "Add Device" to register your first ESP32.</p>
        </div>
      )}
    </div>
  );
};
