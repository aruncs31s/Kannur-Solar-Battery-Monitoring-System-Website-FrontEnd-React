import { LucideIcon, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface BaseButtonProps {
  label: string;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

interface ActionButtonProps extends BaseButtonProps {
  to?: never;
}

interface ActionLinkProps extends BaseButtonProps {
  to: string;
  onClick?: never;
}

type ActionButtonComponentProps = ActionButtonProps | ActionLinkProps;

export const ActionButton = ({ 
  label, 
  icon: Icon, 
  variant = 'primary',
  onClick,
  to,
  disabled = false,
  loading = false,
  className = ''
}: ActionButtonComponentProps) => {
  const variantClasses = {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    info: 'bg-blue-600 hover:bg-blue-700 text-white',
  };

  const isActuallyDisabled = disabled || loading;

  const baseClasses = `${variantClasses[variant]} px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
    isActuallyDisabled ? 'opacity-60 cursor-not-allowed scale-[0.98]' : 'active:scale-95'
  } ${className}`;

  const content = (
    <>
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        Icon && <Icon size={20} />
      )}
      <span>{label}</span>
    </>
  );

  if (to && !loading) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      onClick={loading ? undefined : onClick} 
      disabled={isActuallyDisabled} 
      className={baseClasses}
    >
      {content}
    </button>
  );
};
