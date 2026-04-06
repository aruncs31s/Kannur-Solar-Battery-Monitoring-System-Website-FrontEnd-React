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
    <div className="bg-surface-secondary border border-border-primary rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Activity className={getActivityColor(activity.action)} size={20} />
          <div className="flex-1">
            <p className="font-medium text-text-primary">{activity.action}</p>
            <p className="text-sm text-text-secondary mt-1">{activity.details}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{formatTimestamp(activity.timestamp)}</span>
              </div>
              <div className="flex items-center gap-1">
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
