import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { readingsAPI } from '../api/readings';
import { StatsCard } from '../components/Cards';
import { AllDevicesSection } from '../components/AllDevicesSection';
import { LiveReadingsSection } from '../components/LiveReadingsSection';
import { Section } from '../components/Section';
import { AlertsBanner } from '../components/AlertsBanner';
import { container } from '../application/di/container';
import { Package, CheckCircle, Zap, Battery, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { limitArraySize } from '../utils/performanceConfig';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { devices, setDevices, setLoading, setError } = useDevicesStore();
  const [readings, setReadings] = useState<any[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [recentDevices, setRecentDevices] = useState<any[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [offlineDevices, setOfflineDevices] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [loadingReadings, setLoadingReadings] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const response = await devicesAPI.getAllDevices();
        if (isMounted) {
          setDevices(response);
          if (response.length > 0) {
            setSelectedDeviceId(response[0].id);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch devices');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDevices();
    return () => { isMounted = false; };
  }, [setDevices, setLoading, setError]);

  useEffect(() => {
    let isMounted = true;
    const fetchRecentDevices = async () => {
      setLoadingRecent(true);
      try {
        const getRecentDevicesUseCase = container.getGetRecentDevicesUseCase();
        const recent = await getRecentDevicesUseCase.execute();
        if (isMounted) {
          setRecentDevices(recent.slice(0, 5)); // Show only last 5
        }
      } catch (err) {
        console.error('Failed to fetch recent devices:', err);
      } finally {
        if (isMounted) {
          setLoadingRecent(false);
        }
      }
    };

    fetchRecentDevices();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchOfflineDevices = async () => {
      try {
        const getOfflineDevicesUseCase = container.getGetOfflineDevicesUseCase();
        const offline = await getOfflineDevicesUseCase.execute();
        if (isMounted) {
          setOfflineDevices(offline);
        }
      } catch (err) {
        console.error('Failed to fetch offline devices:', err);
      }
    };

    fetchOfflineDevices();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchReadings = async () => {
      if (!selectedDeviceId || !isMounted) return;
      setLoadingReadings(true);
      try {
        const data = await readingsAPI.getProgressiveByDevice(selectedDeviceId);
        if (isMounted) {
          // Limit readings to prevent memory bloat
          setReadings(limitArraySize(data, 50));
          setError('');
        }
      } catch (err) {
        console.error('Failed to fetch readings:', err);
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
      fetchReadings();
      intervalId = setInterval(fetchReadings, 30000);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [selectedDeviceId, setError]);

  const activeDevices = devices.filter((d) => d.device_state === 1).length;

  // Calculate system-wide stats using useMemo for performance
  const systemStats = useMemo(() => {
    const totalDevices = devices.length;
    const activeCount = activeDevices;
    
    // For voltage and power, we'd need readings from all devices
    // For now, using selected device as proxy, but this could be improved
    // by fetching readings for all devices or caching them
    const avgVoltage = readings.length > 0
      ? (readings.reduce((sum, r) => sum + r.voltage, 0) / readings.length).toFixed(2)
      : '0.00';
    const totalPower = readings.length > 0
      ? readings[0].power.toFixed(2)
      : '0.00';

    return { totalDevices, activeCount, avgVoltage, totalPower };
  }, [devices, readings, activeDevices]);

  // Generate alerts with improved logic
  const generateAlerts = useMemo(() => {
    const alerts: any[] = [];

    // Check offline devices
    offlineDevices.forEach((device) => {
      alerts.push({
        id: `offline-${device.id}`,
        type: 'critical' as const,
        title: 'Device Offline',
        message: `Device ${device.name} is currently offline.`,
        deviceId: device.id,
        deviceName: device.name,
      });
    });

    // Check voltage anomalies for selected device (assuming solar system, normal range 180-250V)
    if (readings.length > 0 && selectedDeviceId) {
      const latestReading = readings[0];
      const deviceName = devices.find(d => d.id === selectedDeviceId)?.name || 'Unknown Device';

      if (latestReading.voltage > 250) {
        alerts.push({
          id: `high-voltage-${selectedDeviceId}`,
          type: 'warning' as const,
          title: 'High Voltage Detected',
          message: `Voltage is ${latestReading.voltage.toFixed(2)}V, which is above normal range.`,
          deviceId: selectedDeviceId,
          deviceName,
        });
      } else if (latestReading.voltage < 180) {
        alerts.push({
          id: `low-voltage-${selectedDeviceId}`,
          type: 'warning' as const,
          title: 'Low Voltage Detected',
          message: `Voltage is ${latestReading.voltage.toFixed(2)}V, which is below normal range.`,
          deviceId: selectedDeviceId,
          deviceName,
        });
      }

      // Check for zero power (possible issue)
      if (latestReading.power < 1) {
        alerts.push({
          id: `no-power-${selectedDeviceId}`,
          type: 'warning' as const,
          title: 'No Power Generation',
          message: `Device is not generating power. Current power: ${latestReading.power.toFixed(2)}W.`,
          deviceId: selectedDeviceId,
          deviceName,
        });
      }
    }

    return alerts.filter(alert => !dismissedAlerts.has(alert.id));
  }, [offlineDevices, readings, selectedDeviceId, devices, dismissedAlerts]);

  const alerts = generateAlerts;

  const handleDismissAlert = useCallback((alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
  }, []);

  const handleViewDevice = useCallback((deviceId: number) => {
    navigate(`/devices/${deviceId}`);
  }, [navigate]);

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    // For now, just dismiss
    handleDismissAlert(alertId);
  }, [handleDismissAlert]);

  return (
    <div className="space-y-6 pb-8">
      <AlertsBanner
        alerts={alerts}
        onDismiss={handleDismissAlert}
        onViewDevice={handleViewDevice}
        onAcknowledge={handleAcknowledgeAlert}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Devices"
          value={systemStats.totalDevices}
          icon={<Package size={28} />} 
          color="blue" 
          subtitle="Connected devices" 
          onClick={() => navigate('/devices')}
          />
        <StatsCard title="Active Devices" value={systemStats.activeCount} icon={<CheckCircle size={28} />} color="green" subtitle="Currently online" trend={systemStats.activeCount > 0 ? 5 : 0} />
        <StatsCard title="Avg Voltage" value={`${systemStats.avgVoltage}V`} icon={<Zap size={28} />} color="purple" subtitle="System average" />
        <StatsCard title="Total Power" value={`${systemStats.totalPower}W`} icon={<Battery size={28} />} color="indigo" subtitle="Current output" />
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <LiveReadingsSection
          devices={devices}
          readings={readings}
          selectedDeviceId={selectedDeviceId}
          onDeviceChange={setSelectedDeviceId}
          loading={loadingReadings}
        />
      </motion.div>

      <AllDevicesSection devices={devices} />

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <Section title="Recently Created Devices" icon={Clock}>
          {loadingRecent ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">Loading recent devices...</span>
            </div>
          ) : recentDevices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentDevices.map((device) => (
                <div key={device.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{device.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{device.type}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{device.address}, {device.city}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${device.device_state === 1 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recent devices found.</p>
          )}
        </Section>
      </motion.div>
    </div>
  );
};
