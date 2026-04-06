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
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
      <Icon size={16} className="inline mr-2 text-blue-600" />
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white"
      required
    />
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);
