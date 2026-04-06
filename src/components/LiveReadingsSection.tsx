import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, AlertCircle, Zap, TrendingUp, Battery } from 'lucide-react';
import { DeviceResponseDTO, SolarDeviceView } from '../domain/entities/Device';
import { Section } from './Section';

interface LiveReadingsSectionProps {
  devices: SolarDeviceView[];
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
            <p className="text-text-secondary">Loading live readings...</p>
          </div>
        </div>
      ) : devices.length > 0 ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-3">
              Select Device
            </label>
            <select
              value={selectedDeviceId || ''}
              onChange={(e) => onDeviceChange(Number(e.target.value))}
              className="w-full md:w-96 px-4 py-3 border-2 border-border-primary rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-primary text-text-primary font-medium transition-all"
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
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden bg-primary-500 text-white rounded-2xl p-6 shadow-lg border border-primary-400"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <Zap size={32} className="mb-3 text-primary-100" />
                    <p className="text-primary-100 text-sm font-medium">Voltage</p>
                    <p className="text-4xl font-bold mt-2">{readings[0].voltage.toFixed(2)}V</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden bg-success text-white rounded-2xl p-6 shadow-lg border border-success/60"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <Activity size={32} className="mb-3 text-white/90" />
                    <p className="text-white/90 text-sm font-medium">Current</p>
                    <p className="text-4xl font-bold mt-2">{readings[0].current.toFixed(2)}A</p>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden bg-secondary-500 text-white rounded-2xl p-6 shadow-lg border border-secondary-400"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <Battery size={32} className="mb-3 text-white/90" />
                    <p className="text-white/90 text-sm font-medium">Power</p>
                    <p className="text-4xl font-bold mt-2">{readings[0].power.toFixed(2)}W</p>
                  </div>
                </motion.div>
              </div>

              {/* Averages Section */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-primary-600 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg border border-primary-500 ${selectedMetric === 'voltage' ? 'ring-2 ring-primary-400 scale-105' : 'hover:scale-105'
                    }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'voltage' ? 'all' : 'voltage')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-primary-100 text-sm font-medium">Average Voltage</p>
                      <p className="text-3xl font-bold mt-1">{averages.voltage.toFixed(2)}V</p>
                      <p className="text-primary-200 text-xs mt-1">Click to focus</p>
                    </div>
                    <Zap size={32} className="text-primary-100" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-success text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg border border-success/60 ${selectedMetric === 'current' ? 'ring-2 ring-success/80 scale-105' : 'hover:scale-105'
                    }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'current' ? 'all' : 'current')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm font-medium">Average Current</p>
                      <p className="text-3xl font-bold mt-1">{averages.current.toFixed(2)}A</p>
                      <p className="text-white/70 text-xs mt-1">Click to focus</p>
                    </div>
                    <Activity size={32} className="text-white/90" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-secondary-500 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg border border-secondary-400 ${selectedMetric === 'power' ? 'ring-2 ring-secondary-300 scale-105' : 'hover:scale-105'
                    }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'power' ? 'all' : 'power')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm font-medium">Average Power</p>
                      <p className="text-3xl font-bold mt-1">{averages.power.toFixed(2)}W</p>
                      <p className="text-white/70 text-xs mt-1">Click to focus</p>
                    </div>
                    <Battery size={32} className="text-white/90" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-primary-500 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg border border-primary-400 ${selectedMetric === 'avg_voltage' ? 'ring-2 ring-primary-300 scale-105' : 'hover:scale-105'
                    }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'avg_voltage' ? 'all' : 'avg_voltage')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm font-medium">Avg Voltage</p>
                      <p className="text-3xl font-bold mt-1">{averages.avg_voltage.toFixed(2)}V</p>
                      <p className="text-white/70 text-xs mt-1">Click to focus</p>
                    </div>
                    <Zap size={32} className="text-white/90" />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-secondary-600 text-white rounded-2xl p-6 cursor-pointer transition-all duration-200 shadow-lg border border-secondary-500 ${selectedMetric === 'avg_current' ? 'ring-2 ring-secondary-400 scale-105' : 'hover:scale-105'
                    }`}
                  onClick={() => setSelectedMetric(selectedMetric === 'avg_current' ? 'all' : 'avg_current')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/90 text-sm font-medium">Avg Current</p>
                      <p className="text-3xl font-bold mt-1">{averages.avg_current.toFixed(2)}A</p>
                      <p className="text-white/70 text-xs mt-1">Click to focus</p>
                    </div>
                    <Activity size={32} className="text-white/90" />
                  </div>
                </motion.div>
              </div>

              {chartData.length > 1 && (
                <div className="space-y-4">
                  <div className="bg-surface-secondary rounded-2xl p-6 border border-border-primary">
                    <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
                      <TrendingUp size={20} className="text-primary-500" />
                      Voltage Trend {selectedMetric !== 'all' && (selectedMetric === 'voltage' || selectedMetric === 'avg_voltage') && ` - ${selectedMetric === 'voltage' ? 'Voltage' : 'Avg Voltage'} Focus`}
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorAvgVoltage" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--secondary-500)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--secondary-500)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                        <XAxis dataKey="time" stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                        <YAxis stroke="var(--text-tertiary)" style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{
                          backgroundColor: 'var(--surface-primary)',
                          border: '1px solid var(--border-primary)',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-lg)',
                          color: 'var(--text-primary)'
                        }} />
                        {(selectedMetric === 'all' || selectedMetric === 'voltage') && (
                          <Area
                            type="monotone"
                            dataKey="voltage"
                            stroke="var(--primary-500)"
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
                            stroke="var(--secondary-500)"
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
                            stroke="var(--primary-600)"
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
                            stroke="var(--secondary-600)"
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
                  <div className="bg-surface-secondary rounded-2xl p-6 border border-border-primary">
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
                          border: '1px solid var(--border-primary)',
                          borderRadius: '12px',
                          boxShadow: 'var(--shadow-lg)',
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
                            stroke="var(--secondary-500)"
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
                            stroke="var(--primary-500)"
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
                            stroke="var(--primary-600)"
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
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl border border-primary-500"
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
              className="bg-warning-bg border-2 border-warning-border rounded-2xl p-8 text-center"
            >
              <Activity className="mx-auto text-warning mb-4" size={48} />
              <h3 className="text-lg font-bold text-text-primary mb-2">
                No Readings Available
              </h3>
              <p className="text-text-secondary">
                No voltage readings found for this device yet.
              </p>
            </motion.div>

          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto text-text-muted mb-2" size={48} />
          <p className="text-text-secondary">
            No devices found.  add devices to see readings.
          </p>
        </div>

      )}
    </Section>
  );
};
