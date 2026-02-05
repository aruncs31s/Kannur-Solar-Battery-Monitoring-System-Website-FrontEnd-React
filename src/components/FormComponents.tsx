import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormErrorProps {
  message: string;
}

export const FormError = ({ message }: FormErrorProps) => (
  <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
    <div>
      <p className="text-red-900 font-medium text-sm">{message}</p>
    </div>
  </div>
);

interface FormSuccessProps {
  message: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => (
  <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
    <div>
      <p className="text-green-900 font-medium text-sm">{message}</p>
    </div>
  </div>
);

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = ({ label, error, ...props }: FormInputProps) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      className={`rounded-lg border px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
        error
          ? 'border-red-300 focus:ring-red-500 focus:ring-offset-0 bg-red-50'
          : 'border-gray-300 focus:ring-blue-500 focus:ring-offset-0 bg-gray-50 focus:bg-white'
      }`}
      {...props}
    />
    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
  </div>
);

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required,
}: FormFieldProps) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={name} className="text-sm font-semibold text-text-secondary">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      className={`rounded-lg border px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 text-text-primary placeholder-text-tertiary/70 ${
        error
          ? 'border-red-300 focus:ring-red-500 focus:ring-offset-0 bg-red-50'
          : `border-border-primary focus:ring-primary-500 focus:ring-offset-0 bg-surface-secondary focus:bg-surface-secondary text-text-primary focus:text-text-primary`
      }`}
    />
    {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
  </div>
);
