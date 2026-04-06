import { Save, X } from 'lucide-react';

interface FeatureFormProps {
  title: string;
  value: string;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (value: string) => void;
  onCancel: () => void;
  submitLabel: string;
}

export const FeatureForm = ({ title, value, onSubmit, onChange, onCancel, submitLabel }: FeatureFormProps) => {
  return (
    <form onSubmit={onSubmit} className="mb-6 p-4 bg-surface-secondary rounded-lg">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-2">Feature Name</label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
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
            {submitLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};
