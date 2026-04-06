import { Edit, Trash2 } from 'lucide-react';
import { Feature } from '../../../domain/entities/Version';

interface FeatureCardProps {
  feature: Feature;
  onEdit: (feature: Feature) => void;
  onDelete: (id: string) => void;
}

export const FeatureCard = ({ feature, onEdit, onDelete }: FeatureCardProps) => {
  return (
    <div
      className={`p-4 bg-surface-secondary rounded-lg border transition-all ${
        feature.Enabled
          ? 'border-border-primary hover:border-primary/50'
          : 'border-border-primary/50 opacity-70'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-text-primary">{feature.name}</p>
            <span className={`text-xs px-2 py-1 rounded ${
              feature.Enabled
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {feature.Enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(feature)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit feature"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(feature.id.toString())}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete feature"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
