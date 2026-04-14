import { useState, useEffect } from 'react';
import { devicesAPI } from '../../../api/devices';
import { DeviceStateHistoryFilters } from '../../../domain/entities/Device';

export interface DeviceStateRecord {
  timestamp: number;
  state: number;
  stateName: string;
  action: string;
  changedBy: string;
}

const mapStateNameToId = (stateName: string): number => {
  const normalized = stateName.toLowerCase();

  if (normalized.includes('inactive')) return 2;
  if (normalized.includes('active')) return 1;
  if (normalized.includes('maintenance')) return 3;
  if (normalized.includes('decommission')) return 4;
  if (normalized.includes('initial')) return 5;

  return 0;
};

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
      setError('');

      try {
        const filters: DeviceStateHistoryFilters = {};

        if (fromDate) {
          filters.fromDate = fromDate.split('T')[0];
        }

        if (toDate) {
          filters.toDate = toDate.split('T')[0];
        }

        if (selectedStates.length > 0) {
          filters.states = selectedStates;
        }

        const [historyResponse, deviceResponse] = await Promise.all([
          devicesAPI.getDeviceStateHistory(deviceId, Object.keys(filters).length > 0 ? filters : undefined),
          devicesAPI.getDevice(deviceId).catch(() => null),
        ]);

        const mappedHistory: DeviceStateRecord[] = (historyResponse.history || []).map((entry) => ({
          timestamp: Math.floor(new Date(entry.changed_at).getTime() / 1000),
          state: mapStateNameToId(entry.state_name),
          stateName: entry.state_name || 'Unknown',
          action: entry.action_caused || 'N/A',
          changedBy: entry.changed_by || 'System',
        }));

        setHistory(mappedHistory);
        setDeviceName(deviceResponse?.device?.name || `Device #${deviceId}`);
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
