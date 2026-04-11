import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { usersAPI } from '../../../api/users';
import { httpClient } from '../../../infrastructure/http/HttpClient';
import { DeviceResponseDTO } from '../../../domain/entities/Device';
import { AuditLog } from '../../../domain/entities/AuditLog';

export const useProfileData = (id?: number) => {
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState<DeviceResponseDTO[]>([]);
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'activity'>('overview');
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      // If no id, we need a currentUser
      if (!id && !currentUser) return;

      setLoading(true);
      setDevicesLoading(true);
      setActivityLoading(true);
      try {
        const profileData = id 
          ? await httpClient.get<any>(`/users/${id}/profile`)
          : await usersAPI.getProfile();
        
        // In individual user profile, we get common structure
        const p = profileData.profile || profileData;
        setUser(p.user);

        if (p.devices) {
          setDevices(p.devices);
        }
        
        if (p.activity) {
          const mappedLogs = p.activity.map((log: any) => ({
             id: log.id,
             userId: id || currentUser?.id || 0,
             action: log.action,
             entityType: 'Device',
             entityId: log.device_id?.toString() || '',
             details: log.details,
             timestamp: new Date(log.created_at).getTime(),
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
  }, [id, currentUser]);

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
