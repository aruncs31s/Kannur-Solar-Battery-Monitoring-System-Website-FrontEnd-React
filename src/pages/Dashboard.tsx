import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { readingsAPI } from '../api/readings';
import { StatsCard } from '../components/Cards';
import { AllDevicesSection } from '../components/AllDevicesSection';
import { LiveReadingsSection } from '../components/LiveReadingsSection';
import { Section } from '../components/Section';
import { container } from '../application/di/container';
import { Package, CheckCircle, Zap, Battery, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { devices, setDevices, setLoading, setError } = useDevicesStore();
  const [readings, setReadings] = useState<any[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [recentDevices, setRecentDevices] = useState<any[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const response = await devicesAPI.getAllDevices();
        setDevices(response);
        if (response.length > 0) {
          setSelectedDeviceId(response[0].id);
        }
      } catch (err) {
        setError('Failed to fetch devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    const fetchRecentDevices = async () => {
      try {
        const getRecentDevicesUseCase = container.getGetRecentDevicesUseCase();
        const recent = await getRecentDevicesUseCase.execute();
        setRecentDevices(recent.slice(0, 5)); // Show only last 5
      } catch (err) {
        console.error('Failed to fetch recent devices:', err);
      }
    };

    fetchRecentDevices();
  }, []);

  useEffect(() => {
    const fetchReadings = async () => {
      if (!selectedDeviceId) return;
      try {
        const data = await readingsAPI.getByDevice(selectedDeviceId.toString());
        setReadings(data.slice(0, 10));
        setError('');
      } catch (err) {
        console.error('Failed to fetch readings:', err);
        setReadings([]);
      }
    };

    if (selectedDeviceId) {
      fetchReadings();
      const interval = setInterval(fetchReadings, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedDeviceId]);

  const activeDevices = devices.filter((d) => d.device_state === 1).length;
  const avgVoltage =
    readings.length > 0
      ? (readings.reduce((sum, r) => sum + r.voltage, 0) / readings.length).toFixed(2)
      : '0.00';
  const totalPower =
    readings.length > 0
      ? readings[0].power.toFixed(2)
      : '0.00';

  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Devices"
          value={devices.length}
          icon={<Package size={28} />} 
          color="blue" 
          subtitle="Connected devices" 
          onClick={() => navigate('/devices')}
          />
        <StatsCard title="Active Devices" value={activeDevices} icon={<CheckCircle size={28} />} color="green" subtitle="Currently online" trend={activeDevices > 0 ? 5 : 0} />
        <StatsCard title="Avg Voltage" value={`${avgVoltage}V`} icon={<Zap size={28} />} color="purple" subtitle="System average" />
        <StatsCard title="Total Power" value={`${totalPower}W`} icon={<Battery size={28} />} color="indigo" subtitle="Current output" />
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <LiveReadingsSection
          devices={devices}
          readings={readings}
          selectedDeviceId={selectedDeviceId}
          onDeviceChange={setSelectedDeviceId}
        />
      </motion.div>

      <AllDevicesSection devices={devices} />

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        <Section title="Recently Created Devices" icon={Clock}>
          {recentDevices.length > 0 ? (
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
