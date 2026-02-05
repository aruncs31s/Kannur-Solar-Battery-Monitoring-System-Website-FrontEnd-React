import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { devicesAPI } from '../api/devices';
import { FormField } from './FormComponents';
import { CreateSensorDeviceDTO } from '../domain/entities/Device';

interface AddSensorDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceAdded: (device: any) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export const AddSensorDeviceModal = ({ isOpen, onClose, onDeviceAdded, onError, onSuccess }: AddSensorDeviceModalProps) => {
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [formData, setFormData] = useState<CreateSensorDeviceDTO>({
    name: '',
    type: 0,
    ip_address: '',
    mac_address: '',
    firmware_version_id: 0,
    address: '',
    city: '',
  });

  useEffect(() => {
    if (isOpen) {
      const fetchDeviceTypes = async () => {
        try {
          const types = await devicesAPI.getDeviceTypes();
          setDeviceTypes(types);
        } catch (err) {
          console.error('Failed to fetch device types:', err);
        }
      };
      fetchDeviceTypes();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'type' || name === 'firmware_version_id' ? (value ? parseInt(value, 10) : undefined) : value,
    }));
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');
    onSuccess('');

    if (!formData.name || !formData.type) {
      onError('Please fill in all required fields');
      return;
    }

    try {
      const newDevice = await devicesAPI.createSensorDevice(formData);
      onDeviceAdded(newDevice);
      onSuccess('Sensor device added successfully');
      setFormData({
        name: '',
        type: 0,
        ip_address: '',
        mac_address: '',
        firmware_version_id: 0,
        address: '',
        city: '',
      });
      onClose();
    } catch (err: any) {
      onError(err.response?.data?.error || 'Failed to add sensor device');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-primary flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Plus size={24} />
            Add Sensor Device
          </h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleAddDevice} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Device Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Temperature Sensor 001"
              required
            />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Device Type *
              </label>
              <select
                name="type"
                value={formData.type || ''}
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
            <FormField
              label="IP Address"
              name="ip_address"
              value={formData.ip_address || ''}
              onChange={handleInputChange}
              placeholder="192.168.1.100"
            />
            <FormField
              label="MAC Address"
              name="mac_address"
              value={formData.mac_address || ''}
              onChange={handleInputChange}
              placeholder="AA:BB:CC:DD:EE:FF"
            />
            <FormField
              label="Firmware Version ID"
              name="firmware_version_id"
              type="number"
              value={formData.firmware_version_id?.toString() || ''}
              onChange={handleInputChange}
              placeholder="1"
            />
            <FormField
              label="Address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              placeholder="Building A, Floor 1"
            />
            <FormField
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              placeholder="Kannur"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-success hover:opacity-90 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add Sensor Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};