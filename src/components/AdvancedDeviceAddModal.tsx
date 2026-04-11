import { useState } from 'react';
import { Plus } from 'lucide-react';
import { devicesAPI } from '../api/devices';
import { FormField, FormError } from './FormComponents';
import { Modal } from './Modal';

interface AdvancedDeviceAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceTypes: Array<{ id: number; name: string }>;
  onDeviceAdded: (device: any) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export const AdvancedDeviceAddModal = ({
  isOpen,
  onClose,
  deviceTypes,
  onDeviceAdded,
  onError,
  onSuccess
}: AdvancedDeviceAddModalProps) => {
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
    onError('');

    if (!formData.name) {
      const errorMsg = 'Please fill in the device name';
      setCreateError(errorMsg);
      onError(errorMsg);
      return;
    }

    setCreateLoading(true);
    try {
      const newDevice = await devicesAPI.createDevice(formData);
      onDeviceAdded(newDevice);
      onSuccess('Device created successfully');
      setFormData({
        name: '',
        type: 1,
        ip_address: '',
        mac_address: '',
        firmware_version_id: 1,
        address: '',
        city: '',
      });
      onClose();
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to create device';
      setCreateError(errorMsg);
      onError(errorMsg);
    } finally {
      setCreateLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Device"
      size="lg"
    >
      <form onSubmit={handleCreateDevice} className="space-y-">
        {createError && <FormError message={createError} />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Device Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Solar Monitor 1s"
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
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Device Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface-secondary text-text-primary transition-all duration-200"
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
            onClick={onClose}
            className="px-6 py-2.5 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createLoading}
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:bg-surface-secondary disabled:text-text-secondary text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus size={20} />
            {createLoading ? 'Creating...' : 'Create Device'}
          </button>
        </div>
      </form>
    </Modal>
  );
};