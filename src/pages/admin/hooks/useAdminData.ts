import { useState, useEffect } from 'react';
import { useDevicesStore } from '../../../store/devicesStore';
import { devicesAPI } from '../../../api/devices';
import { usersAPI } from '../../../api/users';

export const useAdminData = () => {
  const { setDevices, setLoading, setError } = useDevicesStore();
  const [stats, setStats] = useState({
    totalDevices: 0,
    activeDevices: 0,
    inactiveDevices: 0,
    errorDevices: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchAdminData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [devicesResponse, usersResponse] = await Promise.all([
        devicesAPI.getAllDevices(),
        usersAPI.getAll()
      ]);

      setDevices(devicesResponse);

      // Calculate statistics
      const active = devicesResponse.filter((d: any) => d.device_state === 1).length;
      const inactive = devicesResponse.filter((d: any) => d.device_state === 2).length;
      const error = devicesResponse.filter((d: any) => d.device_state === 3).length;

      setStats({
        totalDevices: devicesResponse.length,
        activeDevices: active,
        inactiveDevices: inactive,
        errorDevices: error,
        totalUsers: usersResponse.length,
      });
      setError('');
    } catch (err) {
      setError('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    fetchAdminData
  };
};
