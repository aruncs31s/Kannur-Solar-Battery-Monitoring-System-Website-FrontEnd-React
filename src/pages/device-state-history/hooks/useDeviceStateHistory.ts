import { useState, useEffect } from 'react';

export interface DeviceStateRecord {
  timestamp: number;
  state: number;
}

export const useDeviceStateHistory = (deviceId?: string) => {
  const [history, setHistory] = useState<DeviceStateRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<number[]>([]);

  useEffect(() => {
    if (!deviceId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        // TODO: Implement API call to fetch device state history
        // const response = await devicesAPI.getStateHistory(deviceId, fromDate, toDate);
        // setHistory(response);
        setHistory([]);
        setDeviceName('Device');
      } catch (err: any) {
        setError(
          err.response?.data?.error || 'Failed to load device state history'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [deviceId, fromDate, toDate, selectedStates]);

  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedStates([]);
  };

  return {
    history,
    loading,
    error,
    deviceName,
    fromDate,
    toDate,
    selectedStates,
    setFromDate,
    setToDate,
    setSelectedStates,
    clearFilters,
  };
};
