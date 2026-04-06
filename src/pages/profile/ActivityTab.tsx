import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { AuditLog } from '../../domain/entities/AuditLog';
import { ActivityItem } from './ActivityItem';

export interface ActivityTabProps {
  activities: AuditLog[];
  loading: boolean;
  getActivityColor: (action: string) => string;
  formatTimestamp: (timestamp: number) => string;
}

export const ActivityTab = ({
  activities,
  loading,
  getActivityColor,
  formatTimestamp,
}: ActivityTabProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="mx-auto text-text-secondary mb-4" size={48} />
        <p className="text-text-secondary">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-text-primary">Recent Activity</h3>
        <Link
          to="/audit"
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View All Activity →
        </Link>
      </div>

      <div className="space-y-3">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            getActivityColor={getActivityColor}
            formatTimestamp={formatTimestamp}
          />
        ))}
      </div>
    </div>
  );
};
