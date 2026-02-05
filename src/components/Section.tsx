import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  headerAction?: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Section = ({ 
  title, 
  description, 
  icon: Icon,
  children, 
  headerAction,
  className = '',
  noPadding = false
}: SectionProps) => {
  return (
    <div className={`bg-surface-primary rounded-2xl shadow-xl border border-border-primary ${className}`}>
      {(title || headerAction) && (
        <div className={`flex items-center justify-between ${noPadding ? 'p-6' : 'p-6 border-b border-border-primary'}`}>
          {title && (
            <div>
              <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
                {Icon && (
                  <div className="p-2 bg-primary-200 dark:bg-primary-900 rounded-xl">
                    <Icon className="text-text-primary" size={24} />
                  </div>
                )}
                {title}
              </h2>
              {description && (
                <p className="text-text-secondary mt-1">{description}</p>
              )}
            </div>
          )}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};
