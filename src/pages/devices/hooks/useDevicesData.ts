import { useState, useEffect } from 'react';
import { useDevicesStore } from '../../../store/devicesStore';
import { devicesAPI } from '../../../api/devices';
import { MainStatsDTO } from '../../../application/types/devices/stats';
import { useSearchStore } from '../../../store/searchStore';

export const useDevicesData = () => {
  const { devices, setDevices } = useDevicesStore();
  const [deviceStats, setDeviceStats] = useState<MainStatsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const { query: searchQuery } = useSearchStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDevices();
    fetchDeviceTypes();
    fetchDeviceStats();
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const results = await devicesAPI.searchDevices(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await devicesAPI.getMyDevices();
      setDevices(response);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceStats = async () => {
    try {
      const response = await devicesAPI.getMainStats();
      setDeviceStats(response);
      console.log('Fetched device statistics:', response);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch device statistics:', err);
      setError('Failed to fetch device statistics');
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const types = await devicesAPI.getDeviceTypes();
      setDeviceTypes(types);
    } catch (err) {
      console.error('Failed to fetch device types:', err);
    }
  };

  const handleDeviceAdded = (newDevice: any) => {
    setDevices([...devices, newDevice]);
    fetchDevices(); // Refresh to get updated data
    fetchDeviceStats();
  };

  const activeDevicesCount = devices.filter(d => d.device_state === 1).length;

  return {
    devices,
    loading,
    error,
    setError,
    success,
    setSuccess,
    deviceTypes,
    searchQuery,
    searchResults,
    showAddModal,
    setShowAddModal,
    handleDeviceAdded,
    activeDevicesCount,
    deviceStats,
  };
};
