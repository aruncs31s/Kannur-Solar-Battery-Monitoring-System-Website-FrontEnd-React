import { useEffect, useState } from 'react';
import { versionsAPI } from '../api/versions';
import { devicesAPI } from '../api/devices';
import { Version, Feature, CreateFeatureDTO } from '../domain/entities/Version';
import { Device } from '../domain/entities/Device';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Settings,
  ChevronRight,
  Tag,
} from 'lucide-react';

export const Versions = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [error, setError] = useState('');

  // Feature form states
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [featureForm, setFeatureForm] = useState({
    name: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedVersion) {
      fetchFeatures(selectedVersion.id);
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (selectedDevice && versions.length > 0) {
      const deviceVersion = versions.find(v => v.id === selectedDevice.version_id.toString());
      if (deviceVersion) {
        setSelectedVersion(deviceVersion);
      }
    }
  }, [selectedDevice, versions]);

  const fetchData = async () => {
    try {
      const [versionsResponse, devicesResponse] = await Promise.all([
        versionsAPI.getAll(),
        devicesAPI.getAllDevices()
      ]);
      setVersions(versionsResponse);
      setDevices(devicesResponse);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const fetchFeatures = async (versionId: string) => {
    try {
      const response = await versionsAPI.getFeaturesByVersion(versionId);
      setFeatures(response);
    } catch (err) {
      setError('Failed to fetch features');
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVersion) return;
    const data: CreateFeatureDTO = {
      version_id: selectedVersion.id,
      name: featureForm.name,
    };
    try {
      await versionsAPI.createFeature(data);
      setFeatureForm({ name: '' });
      setShowAddFeature(false);
      fetchFeatures(selectedVersion.id);
    } catch (err) {
      setError('Failed to create feature');
    }
  };

  const handleUpdateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;
    try {
      await versionsAPI.updateFeature(editingFeature.id, {
        name: featureForm.name,
      });
      setEditingFeature(null);
      setFeatureForm({ name: '' });
      if (selectedVersion) {
        fetchFeatures(selectedVersion.id);
      }
    } catch (err) {
      setError('Failed to update feature');
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await versionsAPI.deleteFeature(id);
        if (selectedVersion) {
          fetchFeatures(selectedVersion.id);
        }
      } catch (err) {
        setError('Failed to delete feature');
      }
    }
  };

  const startEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setFeatureForm({
      name: feature.name,
    });
  };

  const cancelEdit = () => {
    setEditingFeature(null);
    setFeatureForm({ name: '' });
  };

  const getDevicesByVersion = (versionId: string) => {
    return devices.filter(d => d.version_id.toString() === versionId);
  };

  const handleVersionChange = (version: Version) => {
    setSelectedVersion(version);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-text-primary">Version Management</h1>
          <p className="text-text-secondary mt-2">Manage device versions and their features</p>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Devices List */}
        <div className="lg:col-span-1 bg-surface-primary rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
            <Package size={20} />
            Devices & Versions
          </h2>
          
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {devices.map((device) => {
              const version = versions.find(v => v.id === device.version_id.toString());
              const isSelected = selectedDevice?.id === device.id;
              return (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface-secondary hover:bg-surface-tertiary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className={`font-semibold ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                        {device.name}
                      </p>
                      <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-text-secondary'}`}>
                        {device.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                      }`}>
                        {version?.name || 'N/A'}
                      </div>
                      {isSelected && <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {devices.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              <Package className="mx-auto mb-2" size={32} />
              <p>No devices found</p>
            </div>
          )}
        </div>

        {/* Right Panel - Version Details & Features */}
        <div className="lg:col-span-2 space-y-6">
          {/* Version Selector */}
          <div className="bg-surface-primary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
              <Tag size={20} />
              Select Version
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {versions.map((version) => {
                const deviceCount = getDevicesByVersion(version.id).length;
                const isSelected = selectedVersion?.id === version.id;
                return (
                  <button
                    key={version.id}
                    onClick={() => handleVersionChange(version)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-border-primary hover:border-primary/50'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                        {version.name}
                      </p>
                      <p className="text-xs text-text-secondary mt-1">
                        {deviceCount} {deviceCount === 1 ? 'device' : 'devices'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Features Section */}
          {selectedVersion && (
            <div className="bg-surface-primary rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <Settings size={20} />
                    Features for {selectedVersion.name}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Manage features available in this version
                  </p>
                </div>
                <button
                  onClick={() => setShowAddFeature(true)}
                  className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  Add Feature
                </button>
              </div>

              {/* Add Feature Form */}
              {showAddFeature && (
                <form onSubmit={handleCreateFeature} className="mb-6 p-4 bg-surface-secondary rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Add New Feature</h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-text-primary mb-2">Feature Name</label>
                      <input
                        type="text"
                        value={featureForm.name}
                        onChange={(e) => setFeatureForm({ name: e.target.value })}
                        className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface-primary text-text-primary"
                        placeholder="e.g., remote-control, energy-monitoring"
                        required
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddFeature(false);
                          setFeatureForm({ name: '' });
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Edit Feature Form */}
              {editingFeature && (
                <form onSubmit={handleUpdateFeature} className="mb-6 p-4 bg-surface-secondary rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Edit Feature</h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-text-primary mb-2">Feature Name</label>
                      <input
                        type="text"
                        value={featureForm.name}
                        onChange={(e) => setFeatureForm({ name: e.target.value })}
                        className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface-primary text-text-primary"
                        required
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <button
                        type="submit"
                        className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <Save size={16} />
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.id}
                    className="p-4 bg-surface-secondary rounded-lg border border-border-primary hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-text-primary">{feature.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditFeature(feature)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit feature"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFeature(feature.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete feature"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {features.length === 0 && (
                <div className="text-center py-12 text-text-secondary">
                  <Settings className="mx-auto mb-2" size={48} />
                  <p className="text-lg">No features in this version</p>
                  <p className="text-sm mt-1">Click "Add Feature" to create one</p>
                </div>
              )}
            </div>
          )}

          {!selectedVersion && (
            <div className="bg-surface-primary rounded-lg shadow-md p-12 text-center">
              <Tag className="mx-auto mb-4 text-text-tertiary" size={64} />
              <p className="text-xl text-text-secondary">Select a version to view its features</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};