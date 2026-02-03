import { useEffect, useState } from 'react';
import { versionsAPI } from '../api/versions';
import { Version, Feature, CreateVersionDTO, CreateFeatureDTO } from '../domain/entities/Version';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Package,
  List,
} from 'lucide-react';

export const Configuration = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'versions' | 'features'>('versions');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Version form states
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [versionForm, setVersionForm] = useState({
    name: '',
    description: '',
  });

  // Feature form states
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [featureForm, setFeatureForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchVersions();
  }, []);

  useEffect(() => {
    if (selectedVersion) {
      fetchFeatures(selectedVersion);
    }
  }, [selectedVersion]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const response = await versionsAPI.getAll();
      setVersions(response);
      setError('');
    } catch (err) {
      setError('Failed to fetch versions');
    } finally {
      setLoading(false);
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

  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: CreateVersionDTO = {
      name: versionForm.name,
      description: versionForm.description || undefined,
    };
    try {
      await versionsAPI.create(data);
      setVersionForm({ name: '', description: '' });
      setShowAddVersion(false);
      fetchVersions();
    } catch (err) {
      setError('Failed to create version');
    }
  };

  const handleUpdateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVersion) return;
    try {
      await versionsAPI.update(editingVersion.id, {
        name: versionForm.name,
        description: versionForm.description,
      });
      setEditingVersion(null);
      setVersionForm({ name: '', description: '' });
      fetchVersions();
    } catch (err) {
      setError('Failed to update version');
    }
  };

  const handleDeleteVersion = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this version?')) {
      try {
        await versionsAPI.delete(id);
        fetchVersions();
        if (selectedVersion === id) {
          setSelectedVersion('');
          setFeatures([]);
        }
      } catch (err) {
        setError('Failed to delete version');
      }
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVersion) return;
    const data: CreateFeatureDTO = {
      version_id: selectedVersion,
      name: featureForm.name,
      description: featureForm.description || undefined,
    };
    try {
      await versionsAPI.createFeature(data);
      setFeatureForm({ name: '', description: '' });
      setShowAddFeature(false);
      fetchFeatures(selectedVersion);
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
        description: featureForm.description,
      });
      setEditingFeature(null);
      setFeatureForm({ name: '', description: '' });
      fetchFeatures(selectedVersion);
    } catch (err) {
      setError('Failed to update feature');
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await versionsAPI.deleteFeature(id);
        fetchFeatures(selectedVersion);
      } catch (err) {
        setError('Failed to delete feature');
      }
    }
  };

  const startEditVersion = (version: Version) => {
    setEditingVersion(version);
    setVersionForm({
      name: version.name,
      description: version.description || '',
    });
  };

  const startEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setFeatureForm({
      name: feature.name,
      description: feature.description || '',
    });
  };

  const cancelEdit = () => {
    setEditingVersion(null);
    setEditingFeature(null);
    setVersionForm({ name: '', description: '' });
    setFeatureForm({ name: '', description: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-text-primary">Configuration</h1>
          <p className="text-text-secondary mt-2">Manage versions and features</p>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface-secondary p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('versions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'versions'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Package size={16} className="inline mr-2" />
          Versions
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'features'
              ? 'bg-primary text-white'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <List size={16} className="inline mr-2" />
          Features
        </button>
      </div>

      {/* Versions Tab */}
      {activeTab === 'versions' && (
        <div className="bg-surface-primary rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Versions</h2>
            <button
              onClick={() => setShowAddVersion(true)}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Version
            </button>
          </div>

          {/* Add Version Form */}
          {showAddVersion && (
            <form onSubmit={handleCreateVersion} className="mb-6 p-4 bg-surface-secondary rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Version</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
                  <input
                    type="text"
                    value={versionForm.name}
                    onChange={(e) => setVersionForm({ ...versionForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                  <input
                    type="text"
                    value={versionForm.description}
                    onChange={(e) => setVersionForm({ ...versionForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
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
                    setShowAddVersion(false);
                    setVersionForm({ name: '', description: '' });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Version Form */}
          {editingVersion && (
            <form onSubmit={handleUpdateVersion} className="mb-6 p-4 bg-surface-secondary rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Edit Version</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
                  <input
                    type="text"
                    value={versionForm.name}
                    onChange={(e) => setVersionForm({ ...versionForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                  <input
                    type="text"
                    value={versionForm.description}
                    onChange={(e) => setVersionForm({ ...versionForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
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
            </form>
          )}

          {/* Versions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-secondary border-b border-border-primary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Created</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((version) => (
                  <tr key={version.id} className="border-b border-border-primary hover:bg-surface-secondary/50">
                    <td className="px-6 py-4 text-text-primary">{version.name}</td>
                    <td className="px-6 py-4 text-text-secondary">{version.description}</td>
                    <td className="px-6 py-4 text-text-secondary">
                      {version.created_at ? new Date(version.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditVersion(version)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteVersion(version.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="bg-surface-primary rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">Features</h2>
              <select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="mt-2 px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Version</option>
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddFeature(true)}
              disabled={!selectedVersion}
              className="bg-primary hover:bg-primary/80 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Add Feature
            </button>
          </div>

          {/* Add Feature Form */}
          {showAddFeature && selectedVersion && (
            <form onSubmit={handleCreateFeature} className="mb-6 p-4 bg-surface-secondary rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Add New Feature</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
                  <input
                    type="text"
                    value={featureForm.name}
                    onChange={(e) => setFeatureForm({ ...featureForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                  <input
                    type="text"
                    value={featureForm.description}
                    onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
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
                    setFeatureForm({ name: '', description: '' });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit Feature Form */}
          {editingFeature && (
            <form onSubmit={handleUpdateFeature} className="mb-6 p-4 bg-surface-secondary rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Edit Feature</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
                  <input
                    type="text"
                    value={featureForm.name}
                    onChange={(e) => setFeatureForm({ ...featureForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                  <input
                    type="text"
                    value={featureForm.description}
                    onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
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
            </form>
          )}

          {/* Features Table */}
          {selectedVersion && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-secondary border-b border-border-primary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Description</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr key={feature.id} className="border-b border-border-primary hover:bg-surface-secondary/50">
                      <td className="px-6 py-4 text-text-primary">{feature.name}</td>
                      <td className="px-6 py-4 text-text-secondary">{feature.description}</td>
                      <td className="px-6 py-4 text-text-secondary">
                        {feature.created_at ? new Date(feature.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditFeature(feature)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteFeature(feature.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};