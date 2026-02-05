import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { readingsAPI } from '../api/readings';
import { StatsCard } from '../components/Cards';
import { AllDevicesSection } from '../components/AllDevicesSection';
import { Activity, AlertCircle, Package, CheckCircle, Zap, TrendingUp, Battery } from 'lucide-react';

export const Dashboard = () => {
  const { devices, setDevices, setLoading, setError } = useDevicesStore();
  const [readings, setReadings] = useState<any[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

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

  const chartData = readings.slice(0, 10).reverse().map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    voltage: parseFloat(reading.voltage.toFixed(2)),
    current: parseFloat(reading.current.toFixed(2)),
    power: parseFloat(reading.power.toFixed(2)),
  }));

  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Devices" value={devices.length} icon={<Package size={28} />} color="blue" subtitle="Connected devices" />
        <StatsCard title="Active Devices" value={activeDevices} icon={<CheckCircle size={28} />} color="green" subtitle="Currently online" trend={activeDevices > 0 ? 5 : 0} />
        <StatsCard title="Avg Voltage" value={`${avgVoltage}V`} icon={<Zap size={28} />} color="purple" subtitle="System average" />
        <StatsCard title="Total Power" value={`${totalPower}W`} icon={<Battery size={28} />} color="indigo" subtitle="Current output" />
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-3">
            <div className="p-2 bg-primary-200 rounded-xl">
              <Activity className="text-text-primary" size={24} />
            </div>
            Live Readings
          </h2>
          <div className="flex items-center gap-2 text-success">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-semibold">Live</span>
          </div>
        </div>

        {devices.length > 0 ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Select Device</label>
              <select value={selectedDeviceId || ''} onChange={(e) => setSelectedDeviceId(Number(e.target.value))} className="w-full md:w-96 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all">
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>{device.name} - {device.address}</option>
                ))}
              </select>
            </div>

            {readings.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div whileHover={{ scale: 1.01 }} className="relative overflow-hidden bg-primary-200 text-text-primary rounded-2xl p-6 shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/10 rounded-full blur-2xl" />
                    <Zap size={32} className="mb-2 opacity-80" />
                    <p className="text-primary-600 text-sm font-medium">Voltage</p>
                    <p className="text-4xl font-bold mt-1">{readings[0].voltage.toFixed(2)}V</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} className="relative overflow-hidden bg-success text-text-primary rounded-2xl p-6 shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-2xl" />
                    <Activity size={32} className="mb-2 opacity-80" />
                    <p className="text-success/80 text-sm font-medium">Current</p>
                    <p className="text-4xl font-bold mt-1">{readings[0].current.toFixed(2)}A</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} className="relative overflow-hidden bg-primary-300 text-text-primary rounded-2xl p-6 shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-200/10 rounded-full blur-2xl" />
                    <Battery size={32} className="mb-2 opacity-80" />
                    <p className="text-primary-500 text-sm font-medium">Power</p>
                    <p className="text-4xl font-bold mt-1">{readings[0].power.toFixed(2)}W</p>
                  </motion.div>
                </div>

                {chartData.length > 1 && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary-400" />
                        Voltage Trend
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--primary-200)" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="var(--primary-200)" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                          <XAxis dataKey="time" stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                          <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--surface-primary)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: 'var(--text-primary)' }} />
                          <Area type="monotone" dataKey="voltage" stroke="var(--primary-200)" strokeWidth={3} fillOpacity={1} fill="url(#colorVoltage)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-success" />
                        Power &amp; Current
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                          <XAxis dataKey="time" stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                          <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--surface-primary)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: 'var(--text-primary)' }} />
                          <Legend />
                          <Line type="monotone" dataKey="current" stroke="var(--success)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="power" stroke="var(--primary-300)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link to={`/devices/${selectedDeviceId}`} className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl">
                    View Full Device Dashboard
                    <TrendingUp size={18} />
                  </Link>
                </div>
              </div>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl p-8 text-center">
                <Activity className="mx-auto text-yellow-600 dark:text-yellow-400 mb-4" size={48} />
                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">No Readings Available</h3>
                <p className="text-yellow-700 dark:text-yellow-300">No voltage readings found for this device yet.</p>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500 dark:text-gray-400">No devices found. Visit Admin to add devices.</p>
          </div>
        )}
      </motion.div>

      <AllDevicesSection devices={devices} />
    </div>
  );
};
