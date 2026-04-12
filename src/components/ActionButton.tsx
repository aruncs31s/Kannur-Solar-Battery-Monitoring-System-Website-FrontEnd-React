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
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-500/20',
    secondary: 'bg-surface-secondary hover:bg-surface-tertiary text-text-primary border-border-primary',
    success: 'bg-success-bg hover:bg-success text-success hover:text-white border-success-border',
    danger: 'bg-error-bg hover:bg-error text-error hover:text-white border-error-border',
    warning: 'bg-warning-bg hover:bg-warning text-warning hover:text-white border-warning-border',
    info: 'bg-info-bg hover:bg-info text-info hover:text-white border-info-border',
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
