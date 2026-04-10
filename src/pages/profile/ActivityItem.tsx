import { Activity, Clock, Wifi } from 'lucide-react';
import { AuditLog } from '../../domain/entities/AuditLog';

export interface ActivityItemProps {
  activity: AuditLog;
  getActivityColor: (action: string) => string;
  formatTimestamp: (timestamp: number) => string;
}

export const ActivityItem = ({
  activity,
  getActivityColor,
  formatTimestamp,
}: ActivityItemProps) => {
  return (
    <div style={{ background: 'var(--surface-primary)', border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)', padding: '1rem', transition: 'box-shadow 0.2s ease', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px -4px rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div style={{ padding: '0.625rem', background: 'var(--surface-secondary)', borderRadius: '100%', border: '1px solid var(--border-secondary)' }}>
             <Activity className={getActivityColor(activity.action)} size={18} />
          </div>
          <div className="flex-1">
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0, fontSize: '0.95rem' }}>{activity.action}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>{activity.details}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.6rem', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>{formatTimestamp(activity.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi size={12} />
                <span>{activity.ipAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
