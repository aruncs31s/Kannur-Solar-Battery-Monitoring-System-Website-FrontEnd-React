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
      if (searchQuery.trim().length >= 1) {
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
      <div className="bg-surface-primary rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-border-primary">
        <div className="relative p-6 border-b border-border-primary flex justify-between items-center overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-5 rounded-full blur-3xl" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-text-primary">Add Connected Device</h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors p-2 hover:bg-surface-secondary rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-6 pb-0">
          <div className="flex gap-2 bg-surface-secondary rounded-xl p-1">
            <button
              type="button"
              onClick={() => setAddConnectedMode('new')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                addConnectedMode === 'new'
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Create New Device
            </button>
            <button
              type="button"
              onClick={() => setAddConnectedMode('existing')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                addConnectedMode === 'existing'
                  ? 'bg-gradient-to-br from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/30'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Add Existing Device
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {addConnectedMode === 'existing' ? (
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-text-secondary mb-3">
                Search Device *
              </label>
              
              {!selectedDevice ? (
                <div className="relative space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-text-tertiary" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by device name..."
                      className="w-full pl-10 pr-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-text-primary focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition-all"
                    />
                    {isSearching && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary-500"></div>
                      </div>
                    )}
                  </div>
                  
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
                          className="px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 cursor-pointer transition-colors flex items-center gap-3 group"
                        >
                          <div className="h-10 w-10 rounded-lg bg-secondary-100/30 dark:bg-secondary-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary-200/50">
                            <Cpu size={20} className="text-secondary-500" />
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
                <div className="relative overflow-hidden p-4 bg-gradient-to-br from-secondary-50 to-secondary-100/50 dark:from-secondary-900/10 dark:to-secondary-900/5 border border-secondary-200 dark:border-secondary-800 rounded-xl group transition-all shadow-lg shadow-secondary-500/10 hover:shadow-secondary-500/20">
                  <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary-500 opacity-5 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-success opacity-5 rounded-full blur-2xl" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-secondary-500 to-secondary-600 shadow-lg shadow-secondary-500/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={24} className="text-white" />
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
                      className="p-2 bg-white dark:bg-surface-secondary hover:bg-error/10 dark:hover:bg-error/20 rounded-lg text-text-tertiary hover:text-error transition-colors shadow-sm hover:shadow-error/20"
                      title="Remove selection"
                    >
                      <X size={18} />
                    </button>
                  </div>
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
                  className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
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
              className="px-6 py-2 bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 flex items-center gap-2"
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
