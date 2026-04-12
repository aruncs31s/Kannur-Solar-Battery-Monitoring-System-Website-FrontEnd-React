import { UpdateDeviceDTO } from '../domain/entities/Device';
import { Modal } from './Modal';
import { FormField } from './FormComponents';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Device"
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {message && (
          <div className={`p-4 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
            message.toLowerCase().includes('success') 
              ? 'bg-success-bg text-success border border-success-border' 
              : 'bg-error-bg text-error border border-error-border'
          }`}>
            <p className="text-sm font-semibold">{message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormField
            label="Device Name"
            name="name"
            value={formData.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="Enter device name"
          />

          <div className="flex flex-col gap-2 group">
            <label className="text-sm font-bold text-text-secondary group-focus-within:text-primary-500 transition-colors">
              Device Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
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
            onChange={(e) => handleInputChange('ip_address', e.target.value)}
            placeholder="192.168.1.100"
          />

          <FormField
            label="MAC Address"
            name="mac_address"
            value={formData.mac_address || ''}
            onChange={(e) => handleInputChange('mac_address', e.target.value)}
            placeholder="AA:BB:CC:DD:EE:FF"
          />

          <FormField
            label="Firmware Version ID"
            name="firmware_version_id"
            type="number"
            value={formData.firmware_version_id?.toString() || ''}
            onChange={(e) => handleInputChange('firmware_version_id', parseInt(e.target.value))}
            placeholder="Enter firmware version ID"
          />

          <FormField
            label="Address"
            name="address"
            value={formData.address || ''}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="123 Street Name"
          />

          <FormField
            label="City"
            name="city"
            value={formData.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter city"
          />
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
            className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            Update Device
          </button>
        </div>
      </form>
    </Modal>
  );
};
