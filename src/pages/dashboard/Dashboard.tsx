import { useCallback } from 'react';
import { motion } from 'framer-motion';

import { AllDevicesSection } from '../../components/AllDevicesSection';
import { LiveReadingsSection } from '../../components/LiveReadingsSection';
import { Section } from '../../components/Section';
import { AlertsBanner } from '../../components/AlertsBanner';
import { Clock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardStats } from './components/DashboardStats';
import { useDashboardData } from './hooks/useDashboardData';

export const Dashboard = () => {
  const navigate = useNavigate();
  const {
    devices,
    solarDevices,
    readings,
    selectedDeviceId,
    setSelectedDeviceId,
    recentDevices,
    loadingRecent,
    loadingReadings,
    stats,
    alerts,
    backendAverages,
    lastReadingTime,
    dismissAlert,
    acknowledgeAlert,
  } = useDashboardData();

  const handleViewDevice = useCallback((deviceId: number) => {
    navigate(`/solar-devices/${deviceId}`);
  }, [navigate]);

  const handleViewAllDevices = useCallback(() => {
    navigate('/devices');
  }, [navigate]);

  return (
    <div className="space-y-6 pb-8">
      <AlertsBanner
        alerts={alerts}
        onDismiss={dismissAlert}
        onViewDevice={handleViewDevice}
        onAcknowledge={acknowledgeAlert}
      />

      <DashboardStats stats={stats} onViewDevices={handleViewAllDevices} />

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
        <LiveReadingsSection
          devices={solarDevices}
          readings={readings}
          averages={backendAverages}
          lastReadingTime={lastReadingTime}
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
                <Link
                  key={device.id}
                  to={`/devices/${device.id}`}
                  className="bg-surface-primary p-4 rounded-xl shadow-sm border border-border-primary hover:shadow-md hover:border-primary-500 transition-all block group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-primary group-hover:text-primary-500 transition-colors">{device.name}</h3>
                      <p className="text-sm text-text-secondary">{device.type}</p>
                      <p className="text-xs text-text-muted">{device.address}, {device.city}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${device.device_state === 1 ? 'bg-success' : 'bg-text-muted'}`}></div>
                  </div>
                </Link>
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
