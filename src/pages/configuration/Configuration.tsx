import { useState } from 'react';
import { Package, List } from 'lucide-react';
import { useVersions } from './hooks/useVersions';
import { useFeatures } from './hooks/useFeatures';
import { VersionsTab } from './components/VersionsTab';
import { FeaturesTab } from './components/FeaturesTab';

export const Configuration = () => {
  const [activeTab, setActiveTab] = useState<'versions' | 'features'>('versions');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  
  const { versions, error: versionError, setError: setVersionError, createVersion, updateVersion, deleteVersion } = useVersions();
  const { features, error: featureError, setError: setFeatureError, createFeature, updateFeature, deleteFeature } = useFeatures(selectedVersion);

  const error = versionError || featureError;
  const setError = (err: string) => {
    setVersionError(err);
    setFeatureError(err);
  };

  const handleDeleteVersion = async (id: string) => {
    await deleteVersion(id);
    if (selectedVersion === id) {
      setSelectedVersion('');
    }
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

      <div className="flex space-x-1 bg-surface-secondary p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('versions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'versions' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <Package size={16} className="inline mr-2" />
          Versions
        </button>
        <button
          onClick={() => setActiveTab('features')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'features' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'}`}
        >
          <List size={16} className="inline mr-2" />
          Features
        </button>
      </div>

      {activeTab === 'versions' && (
        <VersionsTab
          versions={versions}
          onCreateVersion={async (name, description) => createVersion({ name, description: description || undefined })}
          onUpdateVersion={async (id, name, description) => updateVersion(id, { name, description })}
          onDeleteVersion={handleDeleteVersion}
          onError={setError}
        />
      )}

      {activeTab === 'features' && (
        <FeaturesTab
          versions={versions}
          features={features}
          selectedVersion={selectedVersion}
          onVersionSelect={setSelectedVersion}
          onCreateFeature={async (versionId, name, description) => createFeature({ version_id: versionId, name, description: description || undefined })}
          onUpdateFeature={async (id, name, description) => updateFeature(id, { name, description })}
          onDeleteFeature={deleteFeature}
          onError={setError}
        />
      )}
    </div>
  );
};
