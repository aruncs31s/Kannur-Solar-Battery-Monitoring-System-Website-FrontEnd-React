import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Activity, Battery, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/Section';
import { LocationDeviceCard } from '../components/LocationDeviceCard';
import { StatsCard } from '../components/Cards';
import { FormError } from '../components/FormComponents';
import { DailyBreakdownCharts } from '../components/DailyBreakdownCharts';
import { locationsAPI } from '../api/locations';
import { readingsAPI } from '../api/readings';
import { LocationResponseDTO, LocationDeviceDTO } from '../domain/entities/Location';
import { Reading } from '../domain/entities/Reading';

export const LocationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationResponseDTO | null>(null);
  const [devices, setDevices] = useState<LocationDeviceDTO[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [readingsExpanded, setReadingsExpanded] = useState(false);
  const [readingsLoading, setReadingsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLocationDetails();
      fetchLocationDevices();
    }
  }, [id]);

  const fetchLocationDetails = async () => {
    try {
      const locationData = await locationsAPI.getLocation(parseInt(id!));
      setLocation(locationData);
    } catch (err: any) {
      setError('Failed to fetch location details');
    }
  };

  const fetchLocationDevices = async () => {
    setLoading(true);
    try {
      // Use the proper API method to get devices by location
      const locationDevices = await locationsAPI.getDevicesByLocation(parseInt(id!));
      setDevices(locationDevices);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch location devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchSevenDaysReadings = async () => {
    setReadingsLoading(true);
    try {
      console.log('Fetching 7 days readings for location:', id);
      const readingsData = await readingsAPI.getSevenDaysByLocation(parseInt(id!));
      console.log('Seven days readings:', readingsData.length);
      setReadings(readingsData);
    } catch (err: any) {
      console.error('Failed to fetch readings:', err);
    } finally {
      setReadingsLoading(false);
    }
  };

  const toggleReadingsSection = () => {
    setReadingsExpanded(!readingsExpanded);
    if (!readingsExpanded && readings.length === 0) {
      // Only fetch if expanding and we haven't loaded data yet
      fetchSevenDaysReadings();
    }
  };

  const getLatestReading = () => {
    if (readings.length === 0) return null;
    return readings[readings.length - 1]; // Most recent reading
  };

  const getChartData = () => {
    if (selectedDay) {
      // Filter readings for selected day
      const dayReadings = readings.filter(reading => {
        const readingDate = new Date(reading.timestamp).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        return readingDate === selectedDay;
      });

      return dayReadings
        .sort((a, b) => a.timestamp - b.timestamp)
        .map(reading => ({
          time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          voltage: reading.voltage ?? 0,
          current: reading.current ?? 0,
          power: reading.power ?? 0
        }));
    } else {
      // Show last 24 hours of data
      const last24Hours = Date.now() - (24 * 60 * 60 * 1000);
      return readings
        .filter(reading => reading.timestamp > last24Hours)
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-50) // Limit to last 50 readings for performance
        .map(reading => ({
          time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          voltage: reading.voltage ?? 0,
          current: reading.current ?? 0,
          power: reading.power ?? 0
        }));
    }
  };

  if (loading && !location) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading location details...</div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Location not found</div>
      </div>
    );
  }

  const latestReading = getLatestReading();
  const avgVoltage = readings.length > 0 ? readings.reduce((sum, r) => sum + (r.voltage ?? 0), 0) / readings.length : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${location.name} - Devices`}
        description={`Managing ${devices.length} devices in ${location.city}, ${location.state}`}
      >
        <button
          onClick={() => navigate('/locations')}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Locations
        </button>
      </PageHeader>

      {error && <FormError message={error} />}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Readings Section - Takes 4/5 of the width (80%) */}
        <div className="xl:col-span-4">
          {/* Collapsible Readings Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-6"
          >
            <button
              onClick={toggleReadingsSection}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-xl"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Detailed View - {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  7-day readings data for all devices in this location
                </p>
              </div>
              <div className="flex items-center gap-3">
                {readingsLoading && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">Loading...</div>
                )}
                {readingsExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </button>

            {/* Expandable Content */}
            {readingsExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                {readingsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-gray-600">Loading readings data...</div>
                  </div>
                ) : readings.length > 0 ? (
                  <div className="space-y-6">
                    {/* Main 7-Day Trends Chart - Show First */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-600"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">7-Day Trends</h3>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12 }}
                            className="text-gray-600 dark:text-gray-400"
                          />
                          <YAxis tick={{ fontSize: 12 }} className="text-gray-600 dark:text-gray-400" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                            labelStyle={{ color: '#374151' }}
                          />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="voltage"
                            stackId="1"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                            name="Voltage (V)"
                          />
                          <Area
                            type="monotone"
                            dataKey="current"
                            stackId="2"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                            name="Current (A)"
                          />
                          <Area
                            type="monotone"
                            dataKey="power"
                            stackId="3"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.3}
                            name="Power (W)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </motion.div>

                    {/* Daily Breakdown Charts */}
                    <DailyBreakdownCharts
                      allReadings={readings}
                      selectedDay={selectedDay}
                      onDaySelect={setSelectedDay}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No readings data available</p>
                    <p className="text-gray-500 dark:text-gray-500">Readings data will appear here once devices start reporting.</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Statistics Cards - Takes 1/5 of the width (20%) */}
        <div className="xl:col-span-1 space-y-6">
          {/* Statistics Cards */}
          <div className="space-y-4">
           
            {/* <StatsCard
              title="Active Devices"
              value={activeDevices}
              icon={<Activity size={20} />}
              color="green"
            /> */}
            {/* <StatsCard
              title="Offline Devices"
              value={offlineDevices}
              icon={<Package size={20} />}
              color="red"
            /> */}
            <StatsCard
              title="Latest Voltage"
              value={latestReading ? `${latestReading.voltage?.toFixed(2)}V` : 'N/A'}
              icon={<Battery size={20} />}
              color="yellow"
            />
            <StatsCard
              title="Avg Voltage (7d)"
              value={avgVoltage > 0 ? `${avgVoltage.toFixed(2)}V` : 'N/A'}
              icon={<TrendingUp size={20} />}
              color="blue"
            />
            {/* <StatsCard
              title="Avg Current (7d)"
              value={avgCurrent > 0 ? `${avgCurrent.toFixed(2)}A` : 'N/A'}
              icon={<Zap size={20} />}
              color="green"
            />
            <StatsCard
              title="Avg Power (7d)"
              value={avgPower > 0 ? `${avgPower.toFixed(2)}W` : 'N/A'}
              icon={<Activity size={20} />}
              color="purple"
            /> */}
             <StatsCard
              title="Total Devices"
              value={devices.length}
              icon={<Package size={20} />}
              color="blue"
            />
          </div>
        </div>
      </div>

      {/* Devices Section - Full width at bottom */}
      <Section title="Devices" description={`All devices located in ${location.name}`}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading devices...</div>
          </div>
        ) : devices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.map((device, index) => (
              <LocationDeviceCard
                key={device.id}
                device={device}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">No devices found</p>
            <p className="text-gray-500 dark:text-gray-500">There are no devices associated with this location yet.</p>
          </div>
        )}
      </Section>
    </div>
  );
};