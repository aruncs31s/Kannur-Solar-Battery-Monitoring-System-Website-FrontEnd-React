import { useState } from 'react';
import { Plus } from 'lucide-react';
import { devicesAPI } from '../api/devices';
import { FormField } from './FormComponents';

interface AddDeviceFormProps {
  deviceTypes: Array<{ id: number; name: string }>;
  onDeviceAdded: (device: any) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export const AddDeviceForm = ({ deviceTypes, onDeviceAdded, onError, onSuccess }: AddDeviceFormProps) => {
  const [showForm, setShowForm] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');
    onSuccess('');

    if (!formData.name || !formData.uid) {
      onError('Please fill in the device name and UID');
      return;
    }

    try {
      const newDevice = await devicesAPI.createDevice(formData);
      onDeviceAdded(newDevice);
      onSuccess('Device added successfully');
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
    } catch (err: any) {
      onError(err.response?.data?.error || 'Failed to add device');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
      >
        <Plus size={20} />
        Add Device
      </button>

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
                  <option value="">Select device type</option>
                  {deviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
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
    </>
  );
};