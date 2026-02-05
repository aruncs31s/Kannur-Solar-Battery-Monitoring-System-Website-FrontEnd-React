import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';

interface BaseButtonProps {
  label: string;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
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

  const baseClasses = `${variantClasses[variant]} px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  const content = (
    <>
      {Icon && <Icon size={20} />}
      {label}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  );
};
