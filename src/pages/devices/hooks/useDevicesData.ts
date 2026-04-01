import { useState, useEffect } from 'react';
import { useDevicesStore } from '../../../store/devicesStore';
import { devicesAPI } from '../../../api/devices';
import { useSearchStore } from '../../../store/searchStore';

export const useDevicesData = () => {
  const { devices, setDevices } = useDevicesStore();
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
    activeDevicesCount
  };
};
