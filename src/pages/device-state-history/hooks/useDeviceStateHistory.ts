import { useState, useEffect } from 'react';
import { DeviceRepository } from '../../../infrastructure/repositories/DeviceRepository';
import { GetDeviceStateHistoryUseCase } from '../../../application/usecases/devices/GetDeviceStateHistoryUseCase';
import { DeviceStateHistoryEntry, DeviceStateHistoryFilters } from '../../../domain/entities/Device';

export const useDeviceStateHistory = (deviceId?: string) => {
  const [history, setHistory] = useState<DeviceStateHistoryEntry[]>([]);
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
      setError('');
      try {
        const repo = new DeviceRepository();
        const useCase = new GetDeviceStateHistoryUseCase(repo);
        
        const filters: DeviceStateHistoryFilters = {};
        if (fromDate) filters.fromDate = fromDate;
        if (toDate) filters.toDate = toDate;
        if (selectedStates.length > 0) filters.states = selectedStates;

        const response = await useCase.execute(deviceId, filters);
        setHistory(response.history);
        
        // Fetch device details for the name
        const deviceData = await repo.getDevice(deviceId);
        setDeviceName(deviceData.device.name);
      } catch (err: any) {
        console.error('Error fetching state history:', err);
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
