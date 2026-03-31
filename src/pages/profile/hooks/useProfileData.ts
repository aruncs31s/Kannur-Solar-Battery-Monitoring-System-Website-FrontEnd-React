import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { devicesAPI } from '../../../api/devices';
import { auditAPI } from '../../../api/audit';
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
      try {
        // Fetch user's devices
        setDevicesLoading(true);
        const allDevices = await devicesAPI.getAllDevices();
        setDevices(allDevices);
        setDevicesLoading(false);

        // Fetch user's recent activity
        setActivityLoading(true);
        const allAuditLogs = await auditAPI.getAll();
        // Filter activities for current user
        const userActivities = allAuditLogs
          .filter(log => log.userId === user.id)
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 10); // Get last 10 activities
        setRecentActivity(userActivities);
        setActivityLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load profile data');
      } finally {
        setLoading(false);
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
