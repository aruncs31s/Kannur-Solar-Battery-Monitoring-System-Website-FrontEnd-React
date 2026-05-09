import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Battery,
  Search,
  RotateCcw,
  MapPin,
  Calendar,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useBatteryMonitor } from './hooks/useBatteryMonitor';

// Palette — distinct colours for up to 8 devices
const DEVICE_COLORS = [
  '#5E81AC',
  '#A3BE8C',
  '#B48EAD',
  '#EBCB8B',
  '#88C0D0',
  '#BF616A',
  '#D08770',
  '#81A1C1',
];

export const BatteryMonitor = () => {
  const {
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
  } = useBatteryMonitor();

  const [yMin, setYMin] = useState('');
  const [yMax, setYMax] = useState('');

  const chartData = getMergedChartData();

  // Derive Y-axis domain
  const yDomain: [number | 'auto', number | 'auto'] = [
    yMin !== '' && !isNaN(+yMin) ? +yMin : 'auto',
    yMax !== '' && !isNaN(+yMax) ? +yMax : 'auto',
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') fetchData();
  };

  const hasData = deviceSeries.length > 0;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Page header */}
      <div className="border-b border-border-primary bg-surface-primary/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-nord-10/20">
              <Battery size={22} className="text-nord-10" />
            </div>
            <div>
              <h1 className="text-xl font-black text-text-primary tracking-tight leading-none">
                Battery Monitor
              </h1>
              <p className="text-xs text-text-muted mt-0.5">
                Voltage telemetry by location &amp; date
              </p>
            </div>
          </div>
          {hasData && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary px-3 py-1.5 rounded-lg hover:bg-surface-secondary transition-all"
            >
              <RotateCcw size={14} />
              New search
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Input form */}
        <motion.div
          layout
          className="card shadow-sm p-6"
        >
          <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-5 flex items-center gap-2">
            <Search size={14} />
            Query Parameters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Location ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={11} />
                Location ID
              </label>
              <input
                id="battery-monitor-location-id"
                type="number"
                min="1"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. 3"
                className="w-full px-4 py-2.5 rounded-xl border border-border-primary bg-surface-secondary text-text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-nord-10/50 transition placeholder:text-text-muted"
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={11} />
                Date
              </label>
              <input
                id="battery-monitor-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-4 py-2.5 rounded-xl border border-border-primary bg-surface-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-nord-10/50 transition"
              />
            </div>

            {/* Y-axis min/max */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={11} />
                Y-Axis Range (V)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  value={yMin}
                  onChange={(e) => setYMin(e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2.5 rounded-xl border border-border-primary bg-surface-secondary text-text-primary text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-nord-10/50 transition placeholder:text-text-muted"
                />
                <input
                  type="number"
                  step="0.1"
                  value={yMax}
                  onChange={(e) => setYMax(e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2.5 rounded-xl border border-border-primary bg-surface-secondary text-text-primary text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-nord-10/50 transition placeholder:text-text-muted"
                />
              </div>
            </div>

            {/* Fetch button */}
            <button
              id="battery-monitor-fetch"
              onClick={fetchData}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-nord-10 hover:bg-nord-10/90 disabled:opacity-60 text-white rounded-xl font-bold text-sm shadow-md shadow-nord-10/30 hover:-translate-y-0.5 transition-all"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {loading ? 'Loading…' : 'Fetch Data'}
            </button>
          </div>

          {/* Quick Y presets */}
          {hasData && (
            <div className="mt-4 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Quick zoom:
              </span>
              {[
                { label: 'Auto', min: '', max: '' },
                { label: '10–14V', min: '10', max: '14' },
                { label: '11–12V', min: '11', max: '12' },
                { label: '11.5–13.5V', min: '11.5', max: '13.5' },
                { label: '12–15V', min: '12', max: '15' },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setYMin(p.min); setYMax(p.max); }}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                    yMin === p.min && yMax === p.max
                      ? 'bg-nord-10 border-nord-10 text-white'
                      : 'border-border-primary text-text-secondary hover:border-nord-10 hover:text-nord-10 bg-surface-primary'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-5 py-4 rounded-xl border border-error/30 bg-error/8 text-error text-sm font-medium"
            >
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location + date info strip */}
        <AnimatePresence>
          {locationInfo && hasData && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-secondary border border-border-primary text-sm font-semibold text-text-primary">
                <MapPin size={14} className="text-nord-10" />
                {locationInfo.name}
                <span className="text-text-muted font-normal text-xs ml-1">
                  (ID: {locationInfo.id})
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-secondary border border-border-primary text-sm font-semibold text-text-primary">
                <Calendar size={14} className="text-nord-10" />
                {new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-secondary border border-border-primary text-sm font-semibold text-text-primary">
                <Activity size={14} className="text-nord-10" />
                {deviceSeries.length} device{deviceSeries.length !== 1 ? 's' : ''}
                &nbsp;·&nbsp;
                {deviceSeries.reduce((s, d) => s + d.points.length, 0)} readings
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main chart */}
        <AnimatePresence>
          {hasData && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="card shadow-sm p-6 space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-text-primary">Battery Monitor</h2>
                  <p className="text-xs text-text-secondary mt-1">
                    Voltage (V) over time — {locationInfo?.name} — {date}
                  </p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={420}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 24, left: 0, bottom: 0 }}
                >
                  <defs>
                    {deviceSeries.map((dev, i) => (
                      <linearGradient
                        key={dev.deviceId}
                        id={`grad-${dev.deviceId}`}
                        x1="0" y1="0" x2="0" y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={DEVICE_COLORS[i % DEVICE_COLORS.length]}
                          stopOpacity={0.75}
                        />
                        <stop
                          offset="95%"
                          stopColor={DEVICE_COLORS[i % DEVICE_COLORS.length]}
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-secondary)"
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="time"
                    stroke="var(--text-muted)"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    label={{
                      value: 'Time',
                      position: 'insideBottom',
                      offset: -2,
                      fill: 'var(--text-secondary)',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                    height={38}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    domain={yDomain}
                    allowDataOverflow
                    label={{
                      value: 'Voltage (V)',
                      angle: -90,
                      position: 'insideLeft',
                      offset: 12,
                      fill: 'var(--text-secondary)',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow-lg)',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                    }}
                    formatter={(value: any, name: string) => {
                      const dev = deviceSeries.find((d) => d.deviceId === name);
                      return [
                        value != null ? `${Number(value).toFixed(3)} V` : '—',
                        dev?.deviceName ?? name,
                      ];
                    }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }}
                    formatter={(value) => {
                      const dev = deviceSeries.find((d) => d.deviceId === value);
                      return dev?.deviceName ?? value;
                    }}
                  />
                  {deviceSeries.map((dev, i) => (
                    <Area
                      key={dev.deviceId}
                      type="monotone"
                      dataKey={dev.deviceId}
                      stroke={DEVICE_COLORS[i % DEVICE_COLORS.length]}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#grad-${dev.deviceId})`}
                      name={dev.deviceId}
                      dot={false}
                      connectNulls={false}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Per-device stat cards */}
        <AnimatePresence>
          {hasData && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {deviceSeries.map((dev, i) => (
                <div
                  key={dev.deviceId}
                  className="card p-5 space-y-3 border-l-4"
                  style={{
                    borderLeftColor: DEVICE_COLORS[i % DEVICE_COLORS.length],
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }}
                    />
                    <h3 className="font-bold text-text-primary text-sm truncate">
                      {dev.deviceName}
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-text-muted mb-1">
                        Avg
                      </p>
                      <p
                        className="text-lg font-black tabular-nums"
                        style={{ color: DEVICE_COLORS[i % DEVICE_COLORS.length] }}
                      >
                        {dev.avgVoltage.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-0.5">
                        <TrendingDown size={8} /> Min
                      </p>
                      <p className="text-lg font-black tabular-nums text-error">
                        {dev.minVoltage.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-wider text-text-muted mb-1 flex items-center justify-center gap-0.5">
                        <TrendingUp size={8} /> Max
                      </p>
                      <p className="text-lg font-black tabular-nums text-success">
                        {dev.maxVoltage.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-muted text-center">
                    {dev.points.length} readings
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty / initial state */}
        {!hasData && !loading && !hasFetched && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-full bg-nord-10/10 flex items-center justify-center mb-5 border border-nord-10/20">
              <Battery size={36} className="text-nord-10 opacity-60" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Enter a Location &amp; Date
            </h3>
            <p className="text-text-secondary text-sm max-w-sm">
              Provide a Location ID and select a date to retrieve voltage readings from the
              server.
            </p>
          </div>
        )}

        {/* No data after fetch */}
        {!hasData && !loading && hasFetched && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Activity size={48} className="text-text-muted mb-4 opacity-30" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No Data Found</h3>
            <p className="text-text-secondary text-sm max-w-sm">
              No voltage readings were recorded for this location on the selected date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
