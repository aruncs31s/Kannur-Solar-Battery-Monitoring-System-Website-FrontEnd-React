import { ReactNode } from 'react';
import { BackButton } from './BackButton';

interface PageHeaderWithBackProps {
  backTo: string;
  backLabel?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export const PageHeaderWithBack = ({ 
  backTo, 
  backLabel = 'Back',
  title, 
  description, 
  children 
}: PageHeaderWithBackProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <BackButton to={backTo} label={backLabel} />
        <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
        {description && <p className="text-text-secondary mt-2">{description}</p>}
      </div>
      {children && (
        <div className="flex gap-4">
          {children}
        </div>
      )}
    </div>
  );
};
