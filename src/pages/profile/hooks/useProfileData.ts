import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { usersAPI } from '../../../api/users';
import { DeviceResponseDTO } from '../../../domain/entities/Device';
import { AuditLog } from '../../../domain/entities/AuditLog';

export const useProfileData = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState<DeviceResponseDTO[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'activity'>('overview');
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      setLoading(true);
      setDevicesLoading(true);
      setActivityLoading(true);
      try {
        const profileData = await usersAPI.getProfile();
        
        // The API returns the user, their devices, and their activity
        if (profileData.devices) {
          setDevices(profileData.devices);
        }
        
        if (profileData.activity) {
           // map activity from API DTO to frontend format if needed
          const mappedLogs = profileData.activity.map((log: any) => ({
             id: log.id,
             userId: user.id || 0,
             action: log.action,
             entityType: 'Device',
             entityId: log.device_id?.toString() || '',
             details: log.details,
             timestamp: new Date(log.created_at).getTime(), // Convert string timestamp to number
             ipAddress: log.ip_address,
          })) as AuditLog[];
          setRecentActivity(mappedLogs);
        }
        
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load profile data');
      } finally {
        setLoading(false);
        setDevicesLoading(false);
        setActivityLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  const stats = {
    totalDevices: devices.length,
    activeDevices: devices.filter(d => d.device_state === 1).length,
    inactiveDevices: devices.filter(d => d.device_state === 0).length,
    totalActivities: recentActivity.length,
  };

  return {
    user,
    loading,
    error,
    devices,
    recentActivity,
    activeTab,
    setActiveTab,
    devicesLoading,
    activityLoading,
    stats
  };
};
