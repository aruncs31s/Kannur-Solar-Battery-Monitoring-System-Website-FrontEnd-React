import { useState, useCallback } from 'react';
import { readingsAPI } from '../../../api/readings';
import { locationsAPI } from '../../../api/locations';
import { LocationResponseDTO } from '../../../domain/entities/Location';

export interface BatteryReadingPoint {
  time: string;        // HH:MM formatted
  timestamp: number;   // for sorting
  voltage: number;
  deviceId: string;
  deviceName: string;
}

export interface DeviceSeriesData {
  deviceId: string;
  deviceName: string;
  points: { time: string; timestamp: number; voltage: number }[];
  avgVoltage: number;
  minVoltage: number;
  maxVoltage: number;
}

export const useBatteryMonitor = () => {
  const today = new Date().toISOString().split('T')[0];

  const [locationId, setLocationId] = useState('');
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationInfo, setLocationInfo] = useState<LocationResponseDTO | null>(null);
  const [deviceSeries, setDeviceSeries] = useState<DeviceSeriesData[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = useCallback(async () => {
    if (!locationId.trim() || !date) {
      setError('Please enter both Location ID and Date.');
      return;
    }

    const locId = parseInt(locationId.trim(), 10);
    if (isNaN(locId) || locId <= 0) {
      setError('Location ID must be a positive integer.');
      return;
    }

    setLoading(true);
    setError('');
    setDeviceSeries([]);
    setLocationInfo(null);
    setHasFetched(true);

    try {
      // Load location info + devices in parallel
      const [locInfo, devices] = await Promise.all([
        locationsAPI.getLocation(locId),
        locationsAPI.getDevicesByLocation(locId),
      ]);
      setLocationInfo(locInfo);

      if (devices.length === 0) {
        setError('No devices found at this location.');
        setLoading(false);
        return;
      }

      // Build start/end of the selected day in local timezone
      const startDate = `${date}T00:00:00`;
      const endDate = `${date}T23:59:59`;

      // Fetch readings for each device in parallel
      const allSeries = await Promise.all(
        devices.map(async (dev) => {
          try {
            const readings = await readingsAPI.getByDateRange({
              deviceId: dev.id.toString(),
              startDate,
              endDate,
              timezone: 'Asia/Kolkata',
            });

            const points = readings
              .filter((r) => r.voltage != null)
              .map((r) => ({
                time: new Date(r.timestamp).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }),
                timestamp: r.timestamp,
                voltage: +(r.voltage ?? 0).toFixed(3),
              }))
              .sort((a, b) => a.timestamp - b.timestamp);

            const voltages = points.map((p) => p.voltage);
            const avgVoltage =
              voltages.length > 0
                ? voltages.reduce((s, v) => s + v, 0) / voltages.length
                : 0;

            return {
              deviceId: dev.id.toString(),
              deviceName: dev.name,
              points,
              avgVoltage: +avgVoltage.toFixed(3),
              minVoltage: voltages.length > 0 ? Math.min(...voltages) : 0,
              maxVoltage: voltages.length > 0 ? Math.max(...voltages) : 0,
            } as DeviceSeriesData;
          } catch {
            return null;
          }
        })
      );

      const validSeries = allSeries.filter(
        (s): s is DeviceSeriesData => s !== null && s.points.length > 0
      );

      if (validSeries.length === 0) {
        setError(`No voltage readings found for this location on ${date}.`);
      } else {
        setDeviceSeries(validSeries);
      }
    } catch (err: any) {
      setError(
        err?.response?.status === 404
          ? `Location ID ${locId} not found.`
          : 'Failed to fetch data. Please check the server connection.'
      );
    } finally {
      setLoading(false);
    }
  }, [locationId, date]);

  const reset = useCallback(() => {
    setDeviceSeries([]);
    setLocationInfo(null);
    setError('');
    setHasFetched(false);
  }, []);

  /**
   * Build a merged time-series for multi-device rendering.
   * Each data point has { time, timestamp, [deviceId]: voltage, ... }
   */
  const getMergedChartData = useCallback(() => {
    if (deviceSeries.length === 0) return [];

    // Collect all unique time strings in order
    const timeSet = new Map<number, string>();
    deviceSeries.forEach((s) =>
      s.points.forEach((p) => timeSet.set(p.timestamp, p.time))
    );

    const sortedTimes = Array.from(timeSet.entries()).sort(([a], [b]) => a - b);

    // Build a lookup map per device
    const lookups: Record<string, Map<number, number>> = {};
    deviceSeries.forEach((s) => {
      lookups[s.deviceId] = new Map(s.points.map((p) => [p.timestamp, p.voltage]));
    });

    return sortedTimes.map(([ts, time]) => {
      const point: Record<string, any> = { time, timestamp: ts };
      deviceSeries.forEach((s) => {
        point[s.deviceId] = lookups[s.deviceId].get(ts) ?? null;
      });
      return point;
    });
  }, [deviceSeries]);

  return {
    locationId,
    setLocationId,
    date,
    setDate,
    loading,
    error,
    locationInfo,
    deviceSeries,
    hasFetched,
    fetchData,
    reset,
    getMergedChartData,
  };
};
