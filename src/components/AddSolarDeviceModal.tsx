import { useState, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { devicesAPI } from '../api/devices';
import { locationsAPI } from '../api/locations';
import { FormField } from './FormComponents';
import { DeviceSearchResultDTO } from '../domain/entities/Device';
import { LocationResponseDTO } from '../domain/entities/Location';

interface AddSolarDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceAdded: (device: any) => void;
  onError: (error: string) => void;
  onSuccess: (message: string) => void;
}

export const AddSolarDeviceModal = ({ isOpen, onClose, onDeviceAdded, onError, onSuccess }: AddSolarDeviceModalProps) => {
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [microcontrollers, setMicrocontrollers] = useState<DeviceSearchResultDTO[]>([]);
  const [microcontrollerSearch, setMicrocontrollerSearch] = useState('');
  const [showMicrocontrollerDropdown, setShowMicrocontrollerDropdown] = useState(false);
  const [locations, setLocations] = useState<LocationResponseDTO[]>([]);
  const [locationSearch, setLocationSearch] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    device_type_id: 1,
    location_id: 0,
    connected_microcontroller_id: 0,
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
      [name]: name === 'connected_microcontroller_id' || name === 'device_type_id' ? parseInt(value, 10) : value,
    }));
  };

  const handleMicrocontrollerSearch = async (query: string) => {
    setMicrocontrollerSearch(query);
    if (query.length > 0) {
      try {
        const results = await devicesAPI.searchMicrocontrollers(query);
        setMicrocontrollers(results);
        setShowMicrocontrollerDropdown(true);
      } catch (err) {
        console.error('Failed to search microcontrollers:', err);
        setMicrocontrollers([]);
      }
    } else {
      setMicrocontrollers([]);
      setShowMicrocontrollerDropdown(false);
    }
  };

  const handleLocationSearch = async (query: string) => {
    setLocationSearch(query);
    if (query.length > 0) {
      try {
        const results = await locationsAPI.searchLocations(query);
        setLocations(results);
        setShowLocationDropdown(true);
      } catch (err) {
        console.error('Failed to search locations:', err);
        setLocations([]);
      }
    } else {
      setLocations([]);
      setShowLocationDropdown(false);
    }
  };

  const selectMicrocontroller = (microcontroller: DeviceSearchResultDTO) => {
    setFormData((prev) => ({
      ...prev,
      connected_microcontroller_id: microcontroller.id,
    }));
    setMicrocontrollerSearch(microcontroller.name);
    setShowMicrocontrollerDropdown(false);
    // Keep focus on the input to maintain styling
    setTimeout(() => {
      const input = document.querySelector('input[placeholder="Search microcontrollers..."]') as HTMLInputElement;
      if (input) input.focus();
    }, 0);
  };

  const selectLocation = (location: LocationResponseDTO) => {
    setFormData((prev) => ({
      ...prev,
      location_id: location.id,
    }));
    setLocationSearch(location.name);
    setShowLocationDropdown(false);
    // Keep focus on the input to maintain styling
    setTimeout(() => {
      const input = document.querySelector('input[placeholder="Search locations..."]') as HTMLInputElement;
      if (input) input.focus();
    }, 0);
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    onError('');
    onSuccess('');

    if (!formData.name) {
      onError('Please fill in all required fields');
      return;
    }

    try {
      const newDevice = await devicesAPI.createSolarDevice(formData);
      onDeviceAdded(newDevice);
      onSuccess('Solar device added successfully');
      setFormData({
        name: '',
        device_type_id: 1,
        location_id: 0,
        connected_microcontroller_id: 1,
      });
      setLocationSearch('');
      setLocations([]);
      setMicrocontrollerSearch('');
      setMicrocontrollers([]);
      onClose();
    } catch (err: any) {
      onError(err.response?.data?.error || 'Failed to add solar device');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-border-primary flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Plus size={24} />
            Add Solar Device
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
              placeholder="My Solar Charger"
              required
            />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Device Type
              </label>
              <select
                name="device_type_id"
                value={formData.device_type_id}
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
            <div className="relative">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Location <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) => handleLocationSearch(e.target.value)}
                  onFocus={() => setShowLocationDropdown(locations.length > 0)}
                  onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                  placeholder="Search locations..."
                  autoComplete="off"
                  className="w-full px-4 py-2 pl-10 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface-secondary text-text-primary focus:bg-surface-secondary focus:text-text-primary"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              </div>
              {showLocationDropdown && locations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-surface-primary border border-border-primary rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      onClick={() => selectLocation(location)}
                      className="px-4 py-2 hover:bg-surface-secondary cursor-pointer text-text-primary"
                    >
                      {location.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Connected Microcontroller
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={microcontrollerSearch}
                  onChange={(e) => handleMicrocontrollerSearch(e.target.value)}
                  onFocus={() => setShowMicrocontrollerDropdown(microcontrollers.length > 0)}
                  onBlur={() => setTimeout(() => setShowMicrocontrollerDropdown(false), 200)}
                  placeholder="Search microcontrollers..."
                  autoComplete="off"
                  className="w-full px-4 py-2 pl-10 border border-border-primary rounded-lg focus:ring-2 focus:ring-primary-500 bg-surface-secondary text-text-primary focus:bg-surface-secondary focus:text-text-primary"
                />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
              </div>
              {showMicrocontrollerDropdown && microcontrollers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-surface-primary border border-border-primary rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {microcontrollers.map((mc) => (
                    <div
                      key={mc.id}
                      onClick={() => selectMicrocontroller(mc)}
                      className="px-4 py-2 hover:bg-surface-secondary cursor-pointer text-text-primary"
                    >
                      {mc.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              Add Solar Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};