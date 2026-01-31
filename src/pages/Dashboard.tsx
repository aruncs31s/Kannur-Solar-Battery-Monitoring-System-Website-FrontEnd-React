import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { readingsAPI } from '../api/readings';
import { StatsCard, StatusBadge } from '../components/Cards';
import { Activity, AlertCircle, Package, CheckCircle, Zap, MapPin, User, TrendingUp, Battery, Cpu, Signal } from 'lucide-react';

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

  const activeDevices = devices.filter((d) => d.status === 'active').length;
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
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-r from-nord-8 via-nord-9 to-nord-10 rounded-3xl p-8 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-nord-4/10 rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="text-5xl font-bold mb-2">Dashboard</h1>
          <p className="text-nord-4 text-lg">Real-time monitoring of your solar battery system</p>
          <div className="flex gap-4 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
              <Signal size={16} className="inline mr-2" />
              {devices.length} Devices
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold">
              <Activity size={16} className="inline mr-2" />
              Live Monitoring
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Devices" value={devices.length} icon={<Package size={28} />} color="blue" subtitle="Connected devices" />
        <StatsCard title="Active Devices" value={activeDevices} icon={<CheckCircle size={28} />} color="green" subtitle="Currently online" trend={activeDevices > 0 ? 5 : 0} />
        <StatsCard title="Avg Voltage" value={`${avgVoltage}V`} icon={<Zap size={28} />} color="purple" subtitle="System average" />
        <StatsCard title="Total Power" value={`${totalPower}W`} icon={<Battery size={28} />} color="indigo" subtitle="Current output" />
      </div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-nord-0 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-nord-8 to-nord-10 rounded-xl">
              <Activity className="text-white" size={24} />
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
                  <option key={device.id} value={device.id}>{device.name} - {device.installedLocation}</option>
                ))}
              </select>
            </div>

            {readings.length > 0 ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="relative overflow-hidden bg-gradient-to-br from-nord-9 to-nord-8 text-white rounded-2xl p-6 shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-nord-4/10 rounded-full blur-2xl" />
                    <Zap size={32} className="mb-2 opacity-80" />
                    <p className="text-nord-4 text-sm font-medium">Voltage</p>
                    <p className="text-4xl font-bold mt-1">{readings[0].voltage.toFixed(2)}V</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="relative overflow-hidden bg-gradient-to-br from-success to-nord-14 text-white rounded-2xl p-6 shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-nord-4/10 rounded-full blur-2xl" />
                    <Activity size={32} className="mb-2 opacity-80" />
                    <p className="text-nord-4 text-sm font-medium">Current</p>
                    <p className="text-4xl font-bold mt-1">{readings[0].current.toFixed(2)}A</p>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="relative overflow-hidden bg-gradient-to-br from-nord-15 to-nord-9 text-white rounded-2xl p-6 shadow-lg">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-nord-4/10 rounded-full blur-2xl" />
                    <Battery size={32} className="mb-2 opacity-80" />
                    <p className="text-nord-4 text-sm font-medium">Power</p>
                    <p className="text-4xl font-bold mt-1">{readings[0].power.toFixed(2)}W</p>
                  </motion.div>
                </div>

                {chartData.length > 1 && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-nord-0 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-nord-8" />
                        Voltage Trend
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#81A1C1" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#81A1C1" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#D8DEE9" />
                          <XAxis dataKey="time" stroke="#4C566A" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#4C566A" style={{ fontSize: '12px' }} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(46, 52, 64, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#D8DEE9' }} />
                          <Area type="monotone" dataKey="voltage" stroke="#81A1C1" strokeWidth={3} fillOpacity={1} fill="url(#colorVoltage)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-nord-0 dark:text-white mb-4 flex items-center gap-2">
                        <Activity size={20} className="text-success" />
                        Power &amp; Current
                      </h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#D8DEE9" />
                          <XAxis dataKey="time" stroke="#4C566A" style={{ fontSize: '12px' }} />
                          <YAxis stroke="#4C566A" style={{ fontSize: '12px' }} />
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(46, 52, 64, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#D8DEE9' }} />
                          <Legend />
                          <Line type="monotone" dataKey="current" stroke="#A3BE8C" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                          <Line type="monotone" dataKey="power" stroke="#B48EAD" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link to={`/devices/${selectedDeviceId}`} className="inline-flex items-center gap-2 bg-gradient-to-r from-nord-8 to-nord-10 text-white px-6 py-3 rounded-xl font-semibold hover:from-nord-9 hover:to-nord-8 transition-all shadow-lg hover:shadow-xl">
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

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <Cpu className="text-white" size={24} />
            </div>
            All Devices
          </h2>
          <Link to="/devices" className="inline-flex items-center gap-2 text-nord-8 hover:text-nord-9 font-semibold transition-colors">
            View All
            <TrendingUp size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.slice(0, 6).map((device, idx) => (
            <motion.div key={device.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -4, scale: 1.02 }}>
              <Link to={`/devices/${device.id}`} className="block border-2 border-nord-4 dark:border-nord-3 rounded-2xl p-5 hover:shadow-2xl hover:border-nord-8 transition-all bg-gradient-to-br from-nord-6 to-nord-5 dark:from-nord-1 dark:to-nord-2">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-nord-0 dark:text-white mb-1">{device.name}</h3>
                    <p className="text-xs text-nord-3 dark:text-nord-4 font-mono">{device.mac}</p>
                  </div>
                  <StatusBadge status={device.status} />
                </div>
                <div className="space-y-2.5 text-sm text-nord-3 dark:text-nord-4">
                  <div className="flex items-center gap-2 bg-nord-5 dark:bg-nord-2 rounded-lg px-3 py-2">
                    <MapPin size={16} className="text-nord-8" />
                    <span className="font-medium">{device.installedLocation || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-nord-5 dark:bg-nord-2 rounded-lg px-3 py-2">
                    <User size={16} className="text-success" />
                    <span className="font-medium">{device.installedBy}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
