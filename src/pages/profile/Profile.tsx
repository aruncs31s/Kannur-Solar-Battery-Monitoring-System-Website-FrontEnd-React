import { FormError } from '../../components/FormComponents';
import { useProfileData } from './hooks/useProfileData';
import { useProfileFormatters } from './useProfileFormatters';
import { UserInfoCard } from './UserInfoCard';
import { TabNavigation, TabType } from './TabNavigation';
import { OverviewTab } from './OverviewTab';
import { DevicesTab } from './DevicesTab';
import { ActivityTab } from './ActivityTab';

export const Profile = () => {
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
  } = useProfileData();

  const {
    getDeviceStatusText,
    formatTimestamp,
    getActivityColor,
  } = useProfileFormatters();

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-4xl font-bold text-text-primary">User Profile</h1>
        <p className="text-text-secondary mt-2">
          View your account information, devices, and activity
        </p>
      </div>

      {error && <FormError message={error} />}

      <UserInfoCard user={user} stats={stats} loading={loading} />

      <div className="bg-surface-primary rounded-lg shadow-md">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={(tab: TabType) => setActiveTab(tab)}
          deviceCount={devices.length}
        />

        <div className="p-6">
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
