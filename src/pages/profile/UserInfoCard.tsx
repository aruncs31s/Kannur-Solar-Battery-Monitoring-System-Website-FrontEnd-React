import { User, HardDrive, CheckCircle, XCircle, Activity } from 'lucide-react';
import { StatCard } from './StatCard';

export interface UserProfile {
  id: string;
  username: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface ProfileStats {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  totalActivities: number;
}

export interface UserInfoCardProps {
  user: UserProfile | null;
  stats: ProfileStats;
  loading: boolean;
}

export const UserInfoCard = ({ user, stats, loading }: UserInfoCardProps) => {
  if (loading) {
    return (
      <div className="bg-surface-primary rounded-lg shadow-md p-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-primary rounded-lg shadow-md p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary-100 p-4 rounded-full">
            <User className="text-primary-500" size={40} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {user?.name || user?.username}
            </h2>
            <p className="text-text-secondary">{user?.email || 'No email provided'}</p>
            {user?.role && (
              <span className="inline-block mt-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {user.role}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-border-primary">
          <StatCard
            icon={<HardDrive size={20} />}
            label="Total Devices"
            value={stats.totalDevices}
            bgColor="bg-info-50"
            iconColor="text-info-700"
          />
          <StatCard
            icon={<CheckCircle size={20} />}
            label="Active Devices"
            value={stats.activeDevices}
            bgColor="bg-success-50"
            iconColor="text-success-700"
          />
          <StatCard
            icon={<XCircle size={20} />}
            label="Inactive Devices"
            value={stats.inactiveDevices}
            bgColor="bg-error-50"
            iconColor="text-error-700"
          />
          <StatCard
            icon={<Activity size={20} />}
            label="Recent Activities"
            value={stats.totalActivities}
            bgColor="bg-warning-50"
            iconColor="text-warning-700"
          />
        </div>
      </div>
    </div>
  );
};
