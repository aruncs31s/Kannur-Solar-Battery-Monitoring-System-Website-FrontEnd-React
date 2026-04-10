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
    <div className="card" style={{ background: 'linear-gradient(135deg, var(--mc-bg) 0%, var(--surface-primary) 100%)', padding: '2rem', border: '1px solid var(--mc-border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, var(--nord-9) 0%, var(--nord-10) 100%)',
            borderRadius: 'var(--radius-full)',
            color: 'white',
            boxShadow: '0 8px 16px -4px var(--nord-9-alpha-40)'
          }}>
            <User size={48} />
          </div>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              {user?.name || user?.username}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.25rem' }}>
              {user?.email || 'No email provided'}
            </p>
            {user?.role && (
              <div className="badge badge-micro" style={{ marginTop: '0.75rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                {user.role}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid var(--border-secondary)', paddingTop: '2rem' }}>
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
