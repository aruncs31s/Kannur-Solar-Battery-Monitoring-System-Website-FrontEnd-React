import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

// Can add Both Device and Solar Device.
export const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-text-primary">{title}</h1>
        <p className="text-text-secondary mt-2">{description}</p>
      </div>
      {children && (
        <div className="flex gap-3">
          {children}
        </div>
      )}
    </div>
  );
};