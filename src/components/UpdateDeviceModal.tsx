import { X } from 'lucide-react';
import { UpdateDeviceDTO } from '../domain/entities/Device';

interface UpdateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: UpdateDeviceDTO;
  onFormChange: (formData: UpdateDeviceDTO) => void;
  deviceTypes: Array<{ id: number; name: string }>;
  message: string;
}

export const UpdateDeviceModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onFormChange,
  deviceTypes,
  message
}: UpdateDeviceModalProps) => {
  if (!isOpen) return null;

  const handleInputChange = (field: keyof UpdateDeviceDTO, value: string | number) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-primary flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text-primary">Update Device</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('success') 
                ? 'bg-success/10 text-success' 
                : 'bg-error/10 text-error'
            }`}>
              {message}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Device Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter device name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Device Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select device type</option>
              {deviceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              IP Address
            </label>
            <input
              type="text"
              value={formData.ip_address}
              onChange={(e) => handleInputChange('ip_address', e.target.value)}
              className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="192.168.1.100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              MAC Address
            </label>
            <input
              type="text"
              value={formData.mac_address}
              onChange={(e) => handleInputChange('mac_address', e.target.value)}
              className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="AA:BB:CC:DD:EE:FF"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Firmware Version ID
            </label>
            <input
              type="number"
              value={formData.firmware_version_id}
              onChange={(e) => handleInputChange('firmware_version_id', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter firmware version ID"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="123 Street Name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter city"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              Update Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
