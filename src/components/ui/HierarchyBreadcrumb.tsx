import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface HierarchyBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const HierarchyBreadcrumb: React.FC<HierarchyBreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <nav className={`hierarchy-breadcrumb ${className}`} aria-label="Hierarchy breadcrumb">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            {isLast ? (
              <span className="hierarchy-step hierarchy-step-current" aria-current="page">
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
            ) : (
              <>
                {item.href ? (
                  <Link to={item.href} className="hierarchy-step">
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </Link>
                ) : (
                  <span className="hierarchy-step" style={{ cursor: 'default' }}>
                    {item.icon && <span>{item.icon}</span>}
                    {item.label}
                  </span>
                )}
                <ChevronRight size={12} className="hierarchy-sep" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
