import { Save, X } from 'lucide-react';

interface EntityFormProps {
  title: string;
  name: string;
  description: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  submitLabel: string;
}

export const EntityForm = ({ title, name, description, onNameChange, onDescriptionChange, onSubmit, onCancel, submitLabel }: EntityFormProps) => (
  <form onSubmit={onSubmit} className="mb-6 p-4 bg-surface-secondary rounded-lg">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-3 py-2 border border-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
    <div className="flex gap-2 mt-4">
      <button type="submit" className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
        <Save size={16} />
        {submitLabel}
      </button>
      <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
        <X size={16} />
        Cancel
      </button>
    </div>
  </form>
);
