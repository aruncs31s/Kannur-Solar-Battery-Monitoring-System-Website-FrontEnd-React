import { LucideIcon } from 'lucide-react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  icon?: LucideIcon;
  iconSize?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({ 
  message = 'No data found',
  icon: Icon = PackageOpen,
  iconSize = 48,
  action
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={iconSize} className="text-text-tertiary mb-4" />
      <p className="text-text-tertiary text-lg mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
