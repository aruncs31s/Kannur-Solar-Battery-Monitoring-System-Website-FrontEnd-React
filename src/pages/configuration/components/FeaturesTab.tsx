import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Version, Feature } from '../../../domain/entities/Version';
import { EntityForm } from './EntityForm';
import { EntityTable } from './EntityTable';

interface FeaturesTabProps {
  versions: Version[];
  features: Feature[];
  selectedVersion: string;
  onVersionSelect: (versionId: string) => void;
  onCreateFeature: (versionId: string, name: string, description: string) => Promise<void>;
  onUpdateFeature: (id: string, name: string, description: string) => Promise<void>;
  onDeleteFeature: (id: string) => Promise<void>;
  onError: (error: string) => void;
}

export const FeaturesTab = ({ versions, features, selectedVersion, onVersionSelect, onCreateFeature, onUpdateFeature, onDeleteFeature, onError }: FeaturesTabProps) => {
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVersion) return;
    try {
      await onCreateFeature(selectedVersion, form.name, form.description);
      setForm({ name: '', description: '' });
      setShowAddFeature(false);
    } catch (err) {
      onError('Failed to create feature');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;
    try {
      await onUpdateFeature(editingFeature.id.toString(), form.name, form.description);
      setEditingFeature(null);
      setForm({ name: '', description: '' });
    } catch (err) {
      onError('Failed to update feature');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await onDeleteFeature(id);
      } catch (err) {
        onError('Failed to delete feature');
      }
    }
  };

  const startEdit = (feature: Feature) => {
    setEditingFeature(feature);
    setForm({ name: feature.name || '', description: feature.description || '' });
  };

  const cancelEdit = () => {
    setEditingFeature(null);
    setShowAddFeature(false);
    setForm({ name: '', description: '' });
  };

  return (
    <div className="bg-surface-primary rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Features</h2>
          <select value={selectedVersion} onChange={(e) => onVersionSelect(e.target.value)} className="mt-2 px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Version</option>
            {versions.map((version) => (
              <option key={version.id} value={version.id}>{version.name}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setShowAddFeature(true)} disabled={!selectedVersion} className="bg-primary hover:bg-primary/80 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add Feature
        </button>
      </div>

      {showAddFeature && selectedVersion && (
        <EntityForm
          title="Add New Feature"
          name={form.name}
          description={form.description}
          onNameChange={(value) => setForm({ ...form, name: value })}
          onDescriptionChange={(value) => setForm({ ...form, description: value })}
          onSubmit={handleCreate}
          onCancel={cancelEdit}
          submitLabel="Save"
        />
      )}

      {editingFeature && (
        <EntityForm
          title="Edit Feature"
          name={form.name}
          description={form.description}
          onNameChange={(value) => setForm({ ...form, name: value })}
          onDescriptionChange={(value) => setForm({ ...form, description: value })}
          onSubmit={handleUpdate}
          onCancel={cancelEdit}
          submitLabel="Update"
        />
      )}

      {selectedVersion && (
        <EntityTable
          data={features}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'description', label: 'Description', render: (f) => <span className="text-text-secondary">{f.description}</span> },
            { key: 'created_at', label: 'Created', render: (f) => <span className="text-text-secondary">{f.created_at ? new Date(f.created_at).toLocaleDateString() : 'N/A'}</span> },
          ]}
          onEdit={startEdit}
          onDelete={handleDelete}
          getItemId={(f) => f.id.toString()}
        />
      )}
    </div>
  );
};
