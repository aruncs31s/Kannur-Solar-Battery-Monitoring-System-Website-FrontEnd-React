import { useCallback, useEffect, useMemo, useState } from 'react';

import { devicesAPI } from '../../../api/devices';
import { readingsAPI } from '../../../api/readings';
import { container } from '../../../application/di/container';
import { DeviceResponseDTO, MainStatsDTO, SolarDeviceView } from '../../../domain/entities/Device';
import { Reading } from '../../../domain/entities/Reading';
import { useDevicesStore } from '../../../store/devicesStore';
import { limitArraySize } from '../../../utils/performanceConfig';

const RECENT_DEVICES_LIMIT = 5;
const READINGS_LIMIT = 50;
const READINGS_POLL_INTERVAL_MS = 30000;

export interface DashboardStats {
  totalDevices: number;
  activeDevices: number;
  avgVoltage: number;
  totalPower: number;
}

export interface DashboardAlert {
  id: string;
  type: 'critical' | 'warning';
  title: string;
  message: string;
  deviceId?: number;
  deviceName?: string;
}

export interface DashboardDataSource {
  getAllDevices: () => Promise<DeviceResponseDTO[]>;
  getSolarDevices: () => Promise<SolarDeviceView[]>;
  getRecentDevices: () => Promise<DeviceResponseDTO[]>;
  getOfflineDevices: () => Promise<DeviceResponseDTO[]>;
  getProgressiveReadings: (deviceId: number) => Promise<Reading[]>;
  getMainStats: () => Promise<MainStatsDTO>;
}


const defaultDataSource: DashboardDataSource = {
  getAllDevices: () => devicesAPI.getMyDevices(),
  getSolarDevices: () => container.getGetMySolarDevicesUseCase().execute(),
  getRecentDevices: () => container.getGetRecentDevicesUseCase().execute(),
  getOfflineDevices: () => container.getGetOfflineDevicesUseCase().execute(),
  getProgressiveReadings: (deviceId: number) => readingsAPI.getProgressiveByDevice(deviceId),
  getMainStats: () => devicesAPI.getMainStats(),
};


export const useDashboardData = (dataSource: DashboardDataSource = defaultDataSource) => {
  const { devices, setDevices, setLoading, setError } = useDevicesStore();
  const [solarDevices, setSolarDevices] = useState<SolarDeviceView[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [recentDevices, setRecentDevices] = useState<DeviceResponseDTO[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [offlineDevices, setOfflineDevices] = useState<DeviceResponseDTO[]>([]);
  const [apiStats, setApiStats] = useState<MainStatsDTO | null>(null);
  const [loadingSolarDevices, setLoadingSolarDevices] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingReadings, setLoadingReadings] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);


  useEffect(() => {
    let isMounted = true;

    const fetchDevices = async () => {
      console.log('Fetching devices for dashboard...');
      setLoading(true);
      try {
        const response = await dataSource.getAllDevices();
        if (!isMounted) {
          return;
        }

        setDevices(response);
        setError(null);

        if (response.length > 0) {
          setSelectedDeviceId((current) => current ?? response[0].id);
        } else {
          setSelectedDeviceId(null);
        }
      } catch {
        if (isMounted) {
          setError('Failed to fetch devices');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchDevices();

    return () => {
      isMounted = false;
    };
  }, [dataSource, setDevices, setError, setLoading]);

  useEffect(() => {
    let isMounted = true;

    const fetchRecentDevices = async () => {
      setLoadingRecent(true);
      try {
        const recent = await dataSource.getRecentDevices();
        if (isMounted) {
          setRecentDevices(recent.slice(0, RECENT_DEVICES_LIMIT));
        }
      } catch (error) {
        console.error('Failed to fetch recent devices:', error);
      } finally {
        if (isMounted) {
          setLoadingRecent(false);
        }
      }
    };

    void fetchRecentDevices();

    return () => {
      isMounted = false;
    };
  }, [dataSource]);

  useEffect(() => {
    let isMounted = true;

    const fetchOfflineDevices = async () => {
      try {
        const offline = await dataSource.getOfflineDevices();
        if (isMounted) {
          setOfflineDevices(offline);
        }
      } catch (error) {
        console.error('Failed to fetch offline devices:', error);
      }
    };

    void fetchOfflineDevices();

    return () => {
      isMounted = false;
    };
  }, [dataSource]);

  useEffect(() => {
    let isMounted = true;

    const fetchSolarDevices = async () => {
      setLoadingSolarDevices(true);
      try {
        const solar = await dataSource.getSolarDevices();
        if (isMounted) {
          setSolarDevices(solar);
        }
      } catch (error) {
        console.error('Failed to fetch solar devices:', error);
      } finally {
        if (isMounted) {
          setLoadingSolarDevices(false);
        }
      }
    };

    void fetchSolarDevices();

    return () => {
      isMounted = false;
    };
  }, [dataSource]);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchReadings = async () => {
      if (!selectedDeviceId || !isMounted) {
        return;
      }

      setLoadingReadings(true);
      try {
        const data = await dataSource.getProgressiveReadings(selectedDeviceId);
        if (isMounted) {
          setReadings(limitArraySize(data, READINGS_LIMIT));
          setError(null);
        }
      } catch (error) {
        console.error('Failed to fetch readings:', error);
        if (isMounted) {
          setReadings([]);
        }
      } finally {
        if (isMounted) {
          setLoadingReadings(false);
        }
      }
    };

    if (selectedDeviceId) {
      void fetchReadings();
      intervalId = setInterval(() => {
        void fetchReadings();
      }, READINGS_POLL_INTERVAL_MS);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [dataSource, selectedDeviceId, setError]);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        const data = await dataSource.getMainStats();
        if (isMounted) {
          setApiStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch main stats:', error);
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    void fetchStats();
    intervalId = setInterval(() => {
      void fetchStats();
    }, READINGS_POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [dataSource]);


  const stats = useMemo<DashboardStats>(() => {
    if (apiStats) {
      return {
        totalDevices: apiStats.total_devices,
        activeDevices: apiStats.active_devices,
        avgVoltage: apiStats.avg_voltage,
        totalPower: apiStats.avg_power, // Mapping AvgPower from backend to totalPower display as requested
      };
    }

    const totalDevices = devices.length;
    const activeDevices = devices.filter((device) => device.device_state === 1).length;

    if (readings.length === 0) {
      return {
        totalDevices,
        activeDevices,
        avgVoltage: 0,
        totalPower: 0,
      };
    }

    const avgVoltage =
      readings.reduce((sum, reading) => sum + (reading.voltage ?? 0), 0) / readings.length;

    return {
      totalDevices,
      activeDevices,
      avgVoltage,
      totalPower: readings[0]?.power ?? 0,
    };
  }, [apiStats, devices, readings]);


  const alerts = useMemo<DashboardAlert[]>(() => {
    const dashboardAlerts: DashboardAlert[] = [];

    offlineDevices.forEach((device) => {
      dashboardAlerts.push({
        id: `offline-${device.id}`,
        type: 'critical',
        title: 'Device Offline',
        message: `Device ${device.name} is currently offline.`,
        deviceId: device.id,
        deviceName: device.name,
      });
    });

    if (readings.length > 0 && selectedDeviceId) {
      const latestReading = readings[0];
      const voltage = latestReading.voltage ?? 0;
      const power = latestReading.power ?? 0;
      const deviceName = devices.find((device) => device.id === selectedDeviceId)?.name ?? 'Unknown Device';

      if (voltage > 250) {
        dashboardAlerts.push({
          id: `high-voltage-${selectedDeviceId}`,
          type: 'warning',
          title: 'High Voltage Detected',
          message: `Voltage is ${voltage.toFixed(2)}V, which is above normal range.`,
          deviceId: selectedDeviceId,
          deviceName,
        });
      } else if (voltage < 180) {
        dashboardAlerts.push({
          id: `low-voltage-${selectedDeviceId}`,
          type: 'warning',
          title: 'Low Voltage Detected',
          message: `Voltage is ${voltage.toFixed(2)}V, which is below normal range.`,
          deviceId: selectedDeviceId,
          deviceName,
        });
      }

      if (power < 1) {
        dashboardAlerts.push({
          id: `no-power-${selectedDeviceId}`,
          type: 'warning',
          title: 'No Power Generation',
          message: `Device is not generating power. Current power: ${power.toFixed(2)}W.`,
          deviceId: selectedDeviceId,
          deviceName,
        });
      }
    }

    return dashboardAlerts.filter((alert) => !dismissedAlerts.has(alert.id));
  }, [devices, dismissedAlerts, offlineDevices, readings, selectedDeviceId]);

  const dismissAlert = useCallback((alertId: string) => {
    setDismissedAlerts((previous) => {
      const next = new Set(previous);
      next.add(alertId);
      return next;
    });
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    dismissAlert(alertId);
  }, [dismissAlert]);

  return {
    devices,
    solarDevices,
    readings,
    selectedDeviceId,
    setSelectedDeviceId,
    recentDevices,
    loadingRecent,
    loadingReadings,
    loadingStats,
    loadingSolarDevices,
    stats,
    alerts,
    dismissAlert,
    acknowledgeAlert,
  };
};

