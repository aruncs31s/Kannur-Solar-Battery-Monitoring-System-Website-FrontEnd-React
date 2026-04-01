import React from 'react';
import { Zap, Activity, Thermometer, DropletIcon } from 'lucide-react';

interface ReadingMetric {
  label: string;
  value: number | null | undefined;
  unit: string;
  color: string;
  icon?: React.ReactNode;
}

interface ReadingMetricsCardProps {
  voltage?: number | null;
  current?: number | null;
  power?: number | null;
  temperature?: number | null;
  updatedAt?: string | number | null;
  className?: string;
  compact?: boolean;
  title?: string;
}

export const ReadingMetricsCard: React.FC<ReadingMetricsCardProps> = ({
  voltage,
  current,
  power,
  temperature,
  updatedAt,
  className = '',
  compact = false,
  title,
}) => {
  const metrics: ReadingMetric[] = [
    {
      label: 'Voltage',
      value: voltage,
      unit: 'V',
      color: 'var(--nord-8)',
      icon: <Zap size={14} />,
    },
    {
      label: 'Current',
      value: current,
      unit: 'A',
      color: 'var(--success)',
      icon: <Activity size={14} />,
    },
    {
      label: 'Power',
      value: power ?? (voltage != null && current != null ? voltage * current : null),
      unit: 'W',
      color: 'var(--nord-15)',
      icon: <DropletIcon size={14} />,
    },
    ...(temperature != null
      ? [{ label: 'Temp', value: temperature, unit: '°C', color: 'var(--warning)', icon: <Thermometer size={14} /> }]
      : []),
  ];

  const validMetrics = metrics.filter(m => m.value != null);

  if (validMetrics.length === 0) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No readings available</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
          {title}
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(validMetrics.length, compact ? 2 : 4)}, 1fr)`, gap: compact ? '0.5rem' : '0.75rem' }}>
        {validMetrics.map(metric => (
          <div key={metric.label} className="metric-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: metric.color }}>
              {metric.icon}
              <span className="metric-label" style={{ color: 'var(--text-muted)' }}>{metric.label}</span>
            </div>
            <div className="metric-value" style={{ color: metric.color, fontSize: compact ? '1.125rem' : '1.5rem' }}>
              {(metric.value ?? 0).toFixed(metric.unit === 'A' ? 2 : metric.unit === '°C' ? 1 : 2)}
              <span style={{ fontSize: '0.7em', fontWeight: 400, marginLeft: '0.15em', opacity: 0.8 }}>{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>
      {updatedAt && (
        <p className="metric-sub" style={{ marginTop: '0.5rem', textAlign: 'right' }}>
          Updated: {typeof updatedAt === 'number' ? new Date(updatedAt).toLocaleString() : updatedAt}
        </p>
      )}
    </div>
  );
};
