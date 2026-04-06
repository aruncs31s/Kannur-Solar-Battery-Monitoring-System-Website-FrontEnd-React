import { useVersions } from './hooks/useVersions';
import { useFeatureForm } from './hooks/useFeatureForm';
import { DeviceList } from './components/DeviceList';
import { VersionSelector } from './components/VersionSelector';
import { FeaturesPanel } from './components/FeaturesPanel';

export const Versions = () => {
  const {
    versions,
    devices,
    features,
    selectedDevice,
    selectedVersion,
    error,
    setSelectedDevice,
    setSelectedVersion,
    setError,
    fetchFeatures,
    getDevicesByVersion,
  } = useVersions();

  const {
    showAddFeature,
    editingFeature,
    featureForm,
    setShowAddFeature,
    setFeatureForm,
    handleCreateFeature,
    handleUpdateFeature,
    handleDeleteFeature,
    startEditFeature,
    cancelEdit,
    cancelAdd,
  } = useFeatureForm(
    () => selectedVersion && fetchFeatures(selectedVersion.id),
    setError
  );

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
        <DeviceList
          devices={devices}
          versions={versions}
          selectedDevice={selectedDevice}
          onDeviceSelect={setSelectedDevice}
        />

        <div className="lg:col-span-2 space-y-6">
          <VersionSelector
            versions={versions}
            selectedVersion={selectedVersion}
            onVersionSelect={setSelectedVersion}
            getDeviceCount={(versionId) => getDevicesByVersion(versionId).length}
          />

          <FeaturesPanel
            selectedVersion={selectedVersion}
            features={features}
            showAddFeature={showAddFeature}
            editingFeature={editingFeature}
            featureFormValue={featureForm.name}
            onAddFeatureClick={() => setShowAddFeature(true)}
            onCreateFeature={(e) => handleCreateFeature(e, selectedVersion!.id.toString())}
            onUpdateFeature={handleUpdateFeature}
            onFeatureFormChange={(value) => setFeatureForm({ name: value })}
            onCancelAdd={cancelAdd}
            onCancelEdit={cancelEdit}
            onEditFeature={startEditFeature}
            onDeleteFeature={handleDeleteFeature}
          />
        </div>
      </div>
    </div>
  );
};