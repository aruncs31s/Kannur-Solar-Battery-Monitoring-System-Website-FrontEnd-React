import { useParams } from 'react-router-dom';
import { FormError } from '../../components/FormComponents';
import { useProfileData } from './hooks/useProfileData';
import { useProfileFormatters } from './useProfileFormatters';
import { UserInfoCard } from './UserInfoCard';
import { TabNavigation, TabType } from './TabNavigation';
import { OverviewTab } from './OverviewTab';
import { DevicesTab } from './DevicesTab';
import { ActivityTab } from './ActivityTab';

export const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : undefined;

  const {
    user,
    loading,
    error,
    devices,
    recentActivity,
    activeTab,
    setActiveTab,
    devicesLoading,
    activityLoading,
    stats,
  } = useProfileData(userId);

  const {
    getDeviceStatusText,
    formatTimestamp,
    getActivityColor,
  } = useProfileFormatters();

  return (
      <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-1">User Profile</h1>
          <p className="text-text-secondary">
            Manage your account settings, devices, and view recent activity.
          </p>
        </div>

        {error && <FormError message={error} />}

        <UserInfoCard user={user} stats={stats} loading={loading} />

        <div className="card">
          <TabNavigation
            activeTab={activeTab}
            onTabChange={(tab: TabType) => setActiveTab(tab)}
            deviceCount={devices.length}
          />

          <div className="card-body" style={{ minHeight: '300px' }}>
            {activeTab === 'overview' && <OverviewTab user={user} />}
            {activeTab === 'devices' && (
              <DevicesTab
                devices={devices}
                loading={devicesLoading}
                getStatusText={getDeviceStatusText}
              />
            )}
            {activeTab === 'activity' && (
              <ActivityTab
                activities={recentActivity}
                loading={activityLoading}
                getActivityColor={getActivityColor}
                formatTimestamp={formatTimestamp}
              />
            )}
          </div>
        </div>
      </div>
    );
};
