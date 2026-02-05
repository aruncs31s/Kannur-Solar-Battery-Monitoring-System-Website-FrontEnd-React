import { ReactNode } from 'react';

interface StatsGridProps {
  children: ReactNode;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const StatsGrid = ({ 
  children, 
  columns = { default: 1, md: 2, lg: 4 } 
}: StatsGridProps) => {
  const gridClasses = `grid gap-6 
    ${columns.default ? `grid-cols-${columns.default}` : ''}
    ${columns.sm ? `sm:grid-cols-${columns.sm}` : ''}
    ${columns.md ? `md:grid-cols-${columns.md}` : ''}
    ${columns.lg ? `lg:grid-cols-${columns.lg}` : ''}
    ${columns.xl ? `xl:grid-cols-${columns.xl}` : ''}
  `;

  return <div className={gridClasses}>{children}</div>;
};
