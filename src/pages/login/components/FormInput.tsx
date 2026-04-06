import { LucideIcon } from 'lucide-react';

interface FormInputProps {
  label: string;
  icon: LucideIcon;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}

export const FormInput = ({ label, icon: Icon, type, value, onChange, placeholder, error }: FormInputProps) => (
  <div>
    <label className="block text-sm font-semibold text-text-secondary mb-2">
      <Icon size={16} className="inline mr-2 text-primary-500" />
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-border-primary rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-surface-secondary focus:bg-surface-primary text-text-primary"
      required
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);
