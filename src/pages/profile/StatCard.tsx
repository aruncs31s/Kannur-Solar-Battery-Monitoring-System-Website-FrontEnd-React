import { ReactNode } from 'react';

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}

export const StatCard = ({ icon, label, value, iconColor }: StatCardProps) => {
  // Map old tailwind colors to custom CSS vars if needed, but we can default to primary text
  let mappedColor = 'var(--text-primary)';
  if (iconColor.includes('success')) mappedColor = 'var(--success)';
  else if (iconColor.includes('error')) mappedColor = 'var(--error)';
  else if (iconColor.includes('warning')) mappedColor = 'var(--warning)';
  else if (iconColor.includes('info')) mappedColor = 'var(--nord-10)';

  return (
    <div className="metric-card" style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-secondary)', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: mappedColor, marginBottom: '0.25rem' }}>
        {icon}
        <span className="metric-label" style={{ color: mappedColor, margin: 0 }}>{label}</span>
      </div>
      <p className="metric-value" style={{ color: 'var(--text-primary)' }}>
        {value}
      </p>
    </div>
  );
};
