import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Cpu, CheckCircle } from 'lucide-react';
import { FormField } from './FormComponents';
import { DeviceTypeDTO, DeviceResponseDTO } from '../domain/entities/Device';
import { devicesAPI } from '../api/devices';

interface AddConnectedDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: string;
  deviceTypes: DeviceTypeDTO[];
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const AddConnectedDeviceModal: React.FC<AddConnectedDeviceModalProps> = ({
  isOpen,
  onClose,
  deviceId,
  deviceTypes,
  onSuccess,
  onError,
}) => {
  const [addConnectedMode, setAddConnectedMode] = useState<'existing' | 'new'>('new');
  const [newConnectedDeviceId, setNewConnectedDeviceId] = useState('');
  const [newConnectedDeviceForm, setNewConnectedDeviceForm] = useState({
    name: '',
    type: 1,
    ip_address: '',
    mac_address: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DeviceResponseDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceResponseDTO | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 3) {
        setIsSearching(true);
        try {
          const results = await devicesAPI.searchDevices(searchQuery);
          setSearchResults(results.filter(d => d.id.toString() !== deviceId));
        } catch (error) {
          console.error('Error searching devices:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, deviceId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId) return;

    try {
      if (addConnectedMode === 'existing') {
        if (!newConnectedDeviceId) {
          onError('Please enter a device ID');
          return;
        }
        await devicesAPI.addConnectedDevice(parseInt(deviceId), parseInt(newConnectedDeviceId));
        onSuccess('Connected device added successfully!');
      } else {
        if (!newConnectedDeviceForm.name || !newConnectedDeviceForm.type) {
          onError('Please fill in required fields');
          return;
        }
        await devicesAPI.createAndConnectDevice(parseInt(deviceId), newConnectedDeviceForm);
        onSuccess('New device created and connected successfully!');
      }

      // Reset internal form state
      setNewConnectedDeviceId('');
      setSelectedDevice(null);
      setSearchQuery('');
      setNewConnectedDeviceForm({ name: '', type: 1, ip_address: '', mac_address: '' });
      onClose();
    } catch (err: any) {
      onError(err?.message || 'Failed to add connected device');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-primary rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-primary flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text-primary">Add Connected Device</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-6 pb-0">
          <div className="flex gap-2 bg-surface-secondary rounded-lg p-1">
            <button
              type="button"
              onClick={() => setAddConnectedMode('new')}
              className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                addConnectedMode === 'new'
                  ? 'bg-primary-500 text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Create New Device
            </button>
            <button
              type="button"
              onClick={() => setAddConnectedMode('existing')}
              className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                addConnectedMode === 'existing'
                  ? 'bg-primary-500 text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Add Existing Device
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {addConnectedMode === 'existing' ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-text-secondary mb-2">
                Search Device *
              </label>
              
              {!selectedDevice ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* <Search size={18} className="text-text-tertiary" /> */}
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by device name..."
                    className="w-full pl-10 pr-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {isSearching && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-surface-primary border border-border-primary rounded-xl shadow-xl max-h-64 overflow-y-auto divide-y divide-border-primary">
                      {searchResults.map((device) => (
                        <div
                          key={device.id}
                          onClick={() => {
                            setSelectedDevice(device);
                            setNewConnectedDeviceId(device.id.toString());
                            setSearchQuery('');
                            setSearchResults([]);
                          }}
                          className="px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-colors flex items-center gap-3"
                        >
                          <div className="h-10 w-10 rounded-lg bg-surface-secondary flex items-center justify-center flex-shrink-0">
                            <Cpu size={20} className="text-primary-500" />
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary">{device.name}</div>
                            <div className="text-xs text-text-secondary mt-0.5">{device.type} &bull; {device.ip_address || 'No IP'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {searchQuery.length >= 3 && !isSearching && searchResults.length === 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-surface-primary border border-border-primary rounded-xl shadow-xl p-6 text-center text-text-secondary">
                      <div className="mb-2 flex justify-center"><Search size={24} className="text-border-primary" /></div>
                      <p className="font-medium text-text-primary">No devices found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  )}
                  <p className="text-xs text-text-secondary mt-2">
                    Search and select an existing device to connect
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-800 rounded-xl relative overflow-hidden group transition-all">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                  <div className="flex items-center gap-3 pl-2">
                    <div className="h-10 w-10 rounded-full bg-white dark:bg-surface-secondary shadow-sm flex items-center justify-center">
                      <CheckCircle size={20} className="text-success" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary text-base">{selectedDevice.name}</div>
                      <div className="text-xs text-text-secondary mt-0.5">{selectedDevice.type} &bull; {selectedDevice.ip_address || 'No IP'}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDevice(null);
                      setNewConnectedDeviceId('');
                    }}
                    className="p-2 bg-white dark:bg-surface-secondary hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-text-tertiary hover:text-error transition-colors shadow-sm"
                    title="Remove selection"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <FormField
                label="Device Name"
                name="name"
                value={newConnectedDeviceForm.name}
                onChange={(e) =>
                  setNewConnectedDeviceForm({ ...newConnectedDeviceForm, name: e.target.value })
                }
                placeholder="ESP32 Board"
                required
              />

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Device Type *
                </label>
                <select
                  value={newConnectedDeviceForm.type}
                  onChange={(e) =>
                    setNewConnectedDeviceForm({
                      ...newConnectedDeviceForm,
                      type: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                value={newConnectedDeviceForm.ip_address}
                onChange={(e) =>
                  setNewConnectedDeviceForm({ ...newConnectedDeviceForm, ip_address: e.target.value })
                }
                placeholder="192.168.1.100"
              />

              <FormField
                label="MAC Address"
                name="mac_address"
                value={newConnectedDeviceForm.mac_address}
                onChange={(e) =>
                  setNewConnectedDeviceForm({
                    ...newConnectedDeviceForm,
                    mac_address: e.target.value,
                  })
                }
                placeholder="AA:BB:CC:DD:EE:FF"
              />
            </>
          )}

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
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              {addConnectedMode === 'existing' ? 'Connect Device' : 'Create & Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
