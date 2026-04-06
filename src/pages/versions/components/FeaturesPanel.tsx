import { Plus, Settings, Tag } from 'lucide-react';
import { Version, Feature } from '../../../domain/entities/Version';
import { FeatureForm } from './FeatureForm';
import { FeatureCard } from './FeatureCard';

interface FeaturesPanelProps {
  selectedVersion: Version | null;
  features: Feature[];
  showAddFeature: boolean;
  editingFeature: Feature | null;
  featureFormValue: string;
  onAddFeatureClick: () => void;
  onCreateFeature: (e: React.FormEvent) => void;
  onUpdateFeature: (e: React.FormEvent) => void;
  onFeatureFormChange: (value: string) => void;
  onCancelAdd: () => void;
  onCancelEdit: () => void;
  onEditFeature: (feature: Feature) => void;
  onDeleteFeature: (id: string) => void;
}

export const FeaturesPanel = ({
  selectedVersion,
  features,
  showAddFeature,
  editingFeature,
  featureFormValue,
  onAddFeatureClick,
  onCreateFeature,
  onUpdateFeature,
  onFeatureFormChange,
  onCancelAdd,
  onCancelEdit,
  onEditFeature,
  onDeleteFeature,
}: FeaturesPanelProps) => {
  if (!selectedVersion) {
    return (
      <div className="bg-surface-primary rounded-lg shadow-md p-12 text-center">
        <Tag className="mx-auto mb-4 text-text-tertiary" size={64} />
        <p className="text-xl text-text-secondary">Select a version to view its features</p>
      </div>
    );
  }

  return (
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
          onClick={onAddFeatureClick}
          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Feature
        </button>
      </div>

      {showAddFeature && (
        <FeatureForm
          title="Add New Feature"
          value={featureFormValue}
          onSubmit={onCreateFeature}
          onChange={onFeatureFormChange}
          onCancel={onCancelAdd}
          submitLabel="Save"
        />
      )}

      {editingFeature && (
        <FeatureForm
          title="Edit Feature"
          value={featureFormValue}
          onSubmit={onUpdateFeature}
          onChange={onFeatureFormChange}
          onCancel={onCancelEdit}
          submitLabel="Update"
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            onEdit={onEditFeature}
            onDelete={onDeleteFeature}
          />
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
  );
};
