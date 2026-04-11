import { AlertCircle, CheckCircle } from 'lucide-react';

interface FormErrorProps {
  message: string;
}

export const FormError = ({ message }: FormErrorProps) => (
  <div className="rounded-xl bg-error-bg border border-error-border p-4 flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
    <AlertCircle className="text-error flex-shrink-0 mt-0.5" size={18} />
    <div>
      <p className="text-text-primary font-semibold text-sm">{message}</p>
    </div>
  </div>
);

interface FormSuccessProps {
  message: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => (
  <div className="rounded-xl bg-success-bg border border-success-border p-4 flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-sm">
    <CheckCircle className="text-success flex-shrink-0 mt-0.5" size={18} />
    <div>
      <p className="text-text-primary font-semibold text-sm">{message}</p>
    </div>
  </div>
);

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = ({ label, error, ...props }: FormInputProps) => (
  <div className="flex flex-col gap-2 group">
    <label className="text-sm font-bold text-text-secondary group-focus-within:text-primary-500 transition-colors">{label}</label>
    <input
      className={`rounded-lg border px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 ${
        error
          ? 'border-error bg-error-bg text-text-primary placeholder-text-muted/50'
          : 'border-border-primary focus:border-primary-500 bg-surface-secondary focus:bg-surface-primary text-text-primary placeholder-text-muted/50'
      }`}
      {...props}
    />
    {error && <p className="text-sm text-error font-medium">{error}</p>}
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
  <div className="flex flex-col gap-2 group">
    <label htmlFor={name} className="text-sm font-bold text-text-secondary group-focus-within:text-primary-500 transition-colors">
      {label} {required && <span className="text-error">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete="off"
      className={`rounded-lg border px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-text-primary placeholder-text-muted/50 ${
        error
          ? 'border-error bg-error-bg'
          : `border-border-primary focus:border-primary-500 bg-surface-secondary focus:bg-surface-primary shadow-sm focus:shadow-md`
      }`}
    />
    {error && <p className="text-sm text-error font-medium">{error}</p>}
  </div>
);
