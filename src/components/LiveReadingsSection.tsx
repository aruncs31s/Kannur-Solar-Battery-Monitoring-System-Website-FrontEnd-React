import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, AlertCircle, Zap, TrendingUp, Battery } from 'lucide-react';
import { DeviceResponseDTO } from '../domain/entities/Device';
import { Section } from './Section';

interface LiveReadingsSectionProps {
  devices: DeviceResponseDTO[];
  readings: any[];
  selectedDeviceId: number | null;
  onDeviceChange: (deviceId: number) => void;
  loading?: boolean;
}

export const LiveReadingsSection = ({ 
  devices, 
  readings, 
  selectedDeviceId, 
  onDeviceChange,
  loading = false
}: LiveReadingsSectionProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'voltage' | 'current' | 'power' | 'avg_voltage' | 'avg_current'>('all');

  // Calculate averages
  const averages = readings.length > 0 ? {
    voltage: readings.reduce((sum, r) => sum + (r.voltage || 0), 0) / readings.length,
    current: readings.reduce((sum, r) => sum + (r.current || 0), 0) / readings.length,
    power: readings.reduce((sum, r) => sum + (r.power || 0), 0) / readings.length,
    avg_voltage: readings.reduce((sum, r) => sum + (r.avg_voltage || 0), 0) / readings.length,
    avg_current: readings.reduce((sum, r) => sum + (r.avg_current || 0), 0) / readings.length,
  } : { voltage: 0, current: 0, power: 0, avg_voltage: 0, avg_current: 0 };

  const chartData = readings.slice(0, 10).reverse().map((reading) => {
    const dataPoint: any = {
      time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      voltage: parseFloat((reading.voltage || 0).toFixed(2)),
      current: parseFloat((reading.current || 0).toFixed(2)),
      power: parseFloat((reading.power || 0).toFixed(2)),
      avg_voltage: parseFloat((reading.avg_voltage || 0).toFixed(2)),
      avg_current: parseFloat((reading.avg_current || 0).toFixed(2)),
    };

    // Add average lines if a specific metric is selected
    if (selectedMetric !== 'all') {
      const avgValue = selectedMetric === 'voltage' ? averages.voltage : 
                      selectedMetric === 'current' ? averages.current : 
                      selectedMetric === 'power' ? averages.power :
                      selectedMetric === 'avg_voltage' ? averages.avg_voltage :
                      averages.avg_current;
      dataPoint[`${selectedMetric}Avg`] = avgValue;
    }

    return dataPoint;
  });

  const headerAction = (
    <div className="flex items-center gap-2 text-success">
      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
      <span className="text-sm font-semibold">Live</span>
    </div>
  );

  return (
    <Section
      title="Live Readings"
      icon={Activity}
      headerAction={headerAction}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading live readings...</p>
          </div>
        </div>
      ) : devices.length > 0 ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Select Device
            </label>
            <select
              value={selectedDeviceId || ''}
              onChange={(e) => onDeviceChange(Number(e.target.value))}
              className="w-full md:w-96 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-all"
            >
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name} - {device.address}
                </option>
              ))}
            </select>
          </div>

          {readings.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="relative overflow-hidden bg-primary-200 text-text-primary rounded-2xl p-6 shadow-lg"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-100/10 rounded-full blur-2xl" />
                  <Zap size={32} className="mb-2 opacity-80" />
                  <p className="text-primary-600 text-sm font-medium">Voltage</p>
                  <p className="text-4xl font-bold mt-1">{readings[0].voltage.toFixed(2)}V</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="relative overflow-hidden bg-success text-text-primary rounded-2xl p-6 shadow-lg"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-2xl" />
                  <Activity size={32} className="mb-2 opacity-80" />
                  <p className="text-success/80 text-sm font-medium">Current</p>
                  <p className="text-4xl font-bold mt-1">{readings[0].current.toFixed(2)}A</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="relative overflow-hidden bg-primary-300 text-text-primary rounded-2xl p-6 shadow-lg"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary-200/10 rounded-full blur-2xl" />
                  <Battery size={32} className="mb-2 opacity-80" />
                  <p className="text-primary-500 text-sm font-medium">Power</p>
                  <p className="text-4xl font-bold mt-1">{readings[0].power.toFixed(2)}W</p>
                </motion.div>
              </div>

              {/* Averages Section */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg ${
                    selectedMetric === 'voltage' ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'voltage' ? 'all' : 'voltage')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Average Voltage</p>
                      <p className="text-3xl font-bold mt-1">{averages.voltage.toFixed(2)}V</p>
                      <p className="text-blue-200 text-xs mt-1">Click to focus</p>
                    </div>
                    <Zap size={32} className="text-blue-200" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br from-green-600 to-green-800 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg ${
                    selectedMetric === 'current' ? 'ring-2 ring-green-400 scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'current' ? 'all' : 'current')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Average Current</p>
                      <p className="text-3xl font-bold mt-1">{averages.current.toFixed(2)}A</p>
                      <p className="text-green-200 text-xs mt-1">Click to focus</p>
                    </div>
                    <Activity size={32} className="text-green-200" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg ${
                    selectedMetric === 'power' ? 'ring-2 ring-purple-400 scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'power' ? 'all' : 'power')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Average Power</p>
                      <p className="text-3xl font-bold mt-1">{averages.power.toFixed(2)}W</p>
                      <p className="text-purple-200 text-xs mt-1">Click to focus</p>
                    </div>
                    <Battery size={32} className="text-purple-200" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg ${
                    selectedMetric === 'avg_voltage' ? 'ring-2 ring-indigo-400 scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'avg_voltage' ? 'all' : 'avg_voltage')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Avg Voltage</p>
                      <p className="text-3xl font-bold mt-1">{averages.avg_voltage.toFixed(2)}V</p>
                      <p className="text-indigo-200 text-xs mt-1">Click to focus</p>
                    </div>
                    <Zap size={32} className="text-indigo-200" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg ${
                    selectedMetric === 'avg_current' ? 'ring-2 ring-teal-400 scale-105' : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'avg_current' ? 'all' : 'avg_current')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-sm font-medium">Avg Current</p>
                      <p className="text-3xl font-bold mt-1">{averages.avg_current.toFixed(2)}A</p>
                      <p className="text-teal-200 text-xs mt-1">Click to focus</p>
                    </div>
                    <Activity size={32} className="text-teal-200" />
                  </div>
                </motion.div>
              </div>

              {chartData.length > 1 && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                      <TrendingUp size={20} className="text-primary-400" />
                      Voltage Trend {selectedMetric !== 'all' && (selectedMetric === 'voltage' || selectedMetric === 'avg_voltage') && ` - ${selectedMetric === 'voltage' ? 'Voltage' : 'Avg Voltage'} Focus`}
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary-200)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--primary-200)" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorAvgVoltage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                        <XAxis dataKey="time" stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                        <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{
                          backgroundColor: 'var(--surface-primary)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          color: 'var(--text-primary)'
                        }} />
                        {(selectedMetric === 'all' || selectedMetric === 'voltage') && (
                          <Area
                            type="monotone"
                            dataKey="voltage"
                            stroke="var(--primary-200)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorVoltage)"
                            name="Voltage (V)"
                          />
                        )}
                        {(selectedMetric === 'all' || selectedMetric === 'avg_voltage') && (
                          <Area
                            type="monotone"
                            dataKey="avg_voltage"
                            stroke="#6366F1"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorAvgVoltage)"
                            name="Avg Voltage (V)"
                          />
                        )}
                        {selectedMetric === 'voltage' && (
                          <Line
                            type="monotone"
                            dataKey="voltageAvg"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Avg Voltage"
                            connectNulls={false}
                          />
                        )}
                        {selectedMetric === 'avg_voltage' && (
                          <Line
                            type="monotone"
                            dataKey="avg_voltageAvg"
                            stroke="#6366F1"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Avg Voltage"
                            connectNulls={false}
                          />
                        )}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Activity size={20} className="text-success" />
                      Power & Current {selectedMetric !== 'all' && ` - ${selectedMetric === 'voltage' ? 'Voltage' : selectedMetric === 'current' ? 'Current' : selectedMetric === 'power' ? 'Power' : selectedMetric === 'avg_voltage' ? 'Avg Voltage' : 'Avg Current'} Focus`}
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                        <XAxis dataKey="time" stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                        <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{
                          backgroundColor: 'var(--surface-primary)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                          color: 'var(--text-primary)'
                        }} />
                        <Legend />
                        {(selectedMetric === 'all' || selectedMetric === 'current') && (
                          <Line
                            type="monotone"
                            dataKey="current"
                            stroke="var(--success)"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Current (A)"
                          />
                        )}
                        {(selectedMetric === 'all' || selectedMetric === 'avg_current') && (
                          <Line
                            type="monotone"
                            dataKey="avg_current"
                            stroke="#14B8A6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Avg Current (A)"
                          />
                        )}
                        {(selectedMetric === 'all' || selectedMetric === 'power') && (
                          <Line
                            type="monotone"
                            dataKey="power"
                            stroke="var(--primary-300)"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Power (W)"
                          />
                        )}
                        {selectedMetric !== 'all' && (
                          <Line
                            type="monotone"
                            dataKey={`${selectedMetric}Avg`}
                            stroke="#3B82F6"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={false}
                            name={`Avg ${selectedMetric === 'voltage' ? 'Voltage' : selectedMetric === 'current' ? 'Current' : selectedMetric === 'power' ? 'Power' : selectedMetric === 'avg_voltage' ? 'Avg Voltage' : 'Avg Current'}`}
                            connectNulls={false}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link
                  to={`/devices/${selectedDeviceId}`}
                  className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  View Full Device Dashboard
                  <TrendingUp size={18} />
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl p-8 text-center"
            >
              <Activity className="mx-auto text-yellow-600 dark:text-yellow-400 mb-4" size={48} />
              <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                No Readings Available
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                No voltage readings found for this device yet.
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
          <p className="text-gray-500 dark:text-gray-400">
            No devices found. Visit Admin to add devices.
          </p>
        </div>
      )}
    </Section>
  );
};
