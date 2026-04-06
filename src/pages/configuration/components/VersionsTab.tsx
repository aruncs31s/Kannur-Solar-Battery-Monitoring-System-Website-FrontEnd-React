import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Version } from '../../../domain/entities/Version';
import { EntityForm } from './EntityForm';
import { EntityTable } from './EntityTable';

interface VersionsTabProps {
  versions: Version[];
  onCreateVersion: (name: string, description: string) => Promise<void>;
  onUpdateVersion: (id: string, name: string, description: string) => Promise<void>;
  onDeleteVersion: (id: string) => Promise<void>;
  onError: (error: string) => void;
}

export const VersionsTab = ({ versions, onCreateVersion, onUpdateVersion, onDeleteVersion, onError }: VersionsTabProps) => {
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [editingVersion, setEditingVersion] = useState<Version | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateVersion(form.name, form.description);
      setForm({ name: '', description: '' });
      setShowAddVersion(false);
    } catch (err) {
      onError('Failed to create version');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVersion) return;
    try {
      await onUpdateVersion(editingVersion.id.toString(), form.name, form.description);
      setEditingVersion(null);
      setForm({ name: '', description: '' });
    } catch (err) {
      onError('Failed to update version');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this version?')) {
      try {
        await onDeleteVersion(id);
      } catch (err) {
        onError('Failed to delete version');
      }
    }
  };

  const startEdit = (version: Version) => {
    setEditingVersion(version);
    setForm({ name: version.name || '', description: version.description || '' });
  };

  const cancelEdit = () => {
    setEditingVersion(null);
    setShowAddVersion(false);
    setForm({ name: '', description: '' });
  };

  return (
    <div className="bg-surface-primary rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Versions</h2>
        <button onClick={() => setShowAddVersion(true)} className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add Version
        </button>
      </div>

      {showAddVersion && (
        <EntityForm
          title="Add New Version"
          name={form.name}
          description={form.description}
          onNameChange={(value) => setForm({ ...form, name: value })}
          onDescriptionChange={(value) => setForm({ ...form, description: value })}
          onSubmit={handleCreate}
          onCancel={cancelEdit}
          submitLabel="Save"
        />
      )}

      {editingVersion && (
        <EntityForm
          title="Edit Version"
          name={form.name}
          description={form.description}
          onNameChange={(value) => setForm({ ...form, name: value })}
          onDescriptionChange={(value) => setForm({ ...form, description: value })}
          onSubmit={handleUpdate}
          onCancel={cancelEdit}
          submitLabel="Update"
        />
      )}

      <EntityTable
        data={versions}
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'description', label: 'Description', render: (v) => <span className="text-text-secondary">{v.description}</span> },
          { key: 'created_at', label: 'Created', render: (v) => <span className="text-text-secondary">{v.created_at ? new Date(v.created_at).toLocaleDateString() : 'N/A'}</span> },
        ]}
        onEdit={startEdit}
        onDelete={handleDelete}
        getItemId={(v) => v.id.toString()}
      />
    </div>
  );
};
