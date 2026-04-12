import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sun, Cpu, ArrowLeft, Activity, Zap, RefreshCw,
  MapPin, Settings, AlertCircle, TrendingUp,
  Battery, Plus
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DeviceStateBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { HierarchyBreadcrumb } from '../../components/ui/HierarchyBreadcrumb';
import { DeviceTokenModal } from '../../components/DeviceTokenModal';
import { AddConnectedDeviceModal } from '../../components/AddConnectedDeviceModal';

// Refactored parts
import { useSolarDeviceDetail } from './hooks/useSolarDeviceDetail';
import { MCCard } from './components/MCCard';

export const SolarDeviceDetail = () => {
  const navigate = useNavigate();
  const {
    id,
    device,
    microcontrollers,
    readings,
    loading,
    error,
    showTokenModal,
    setShowTokenModal,
    generatedToken,
    setGeneratedToken,
    showAddMCModal,
    setShowAddMCModal,
    deviceTypes,
    toggleMC,
    refresh,
    removeMC
  } = useSolarDeviceDetail();

  const chartData = readings
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-60)
    .map(r => ({
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      voltage: +(r.voltage ?? 0).toFixed(2),
      current: +(r.current ?? 0).toFixed(2),
      power: +(r.power ?? 0).toFixed(2),
    }));

  const latestReading = readings.length > 0 ? readings[readings.length - 1] : null;
  const avgVoltage = readings.length > 0 ? readings.reduce((s, r) => s + (r.voltage ?? 0), 0) / readings.length : 0;
  const avgCurrent = readings.length > 0 ? readings.reduce((s, r) => s + (r.current ?? 0), 0) / readings.length : 0;

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="skeleton" style={{ height: 32, width: '40%' }} />
      <div className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[0, 1, 2].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />)}
      </div>
    </div>
  );

  if (error || !device) return (
    <div style={{ padding: '2rem', background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-lg)', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <AlertCircle size={20} />
      {error || 'Device not found'}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate('/solar-devices')}>
          Solar Devices
        </Button>
        <HierarchyBreadcrumb
          items={[
            { label: 'Solar Devices', href: '/solar-devices', icon: <Sun size={12} /> },
            { label: device.name, icon: <Sun size={12} /> },
          ]}
        />
      </div>

      {/* Device Header */}
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.875rem', background: 'var(--solar-bg)', borderRadius: 'var(--radius-lg)', color: 'var(--solar-color)', flexShrink: 0 }}>
            <Sun size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{device.name}</h1>
              <DeviceStateBadge state={device.device_state} />
              <span className="badge badge-solar"><Sun size={11} /> Solar Charger</span>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {device.city && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  <MapPin size={13} />{device.city}
                </span>
              )}
              {device.ip_address && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                  <Zap size={13} />{device.ip_address}
                </span>
              )}
              {device.mac_address && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                  <Activity size={13} />{device.mac_address}
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" leftIcon={<Settings size={14} />} onClick={() => navigate(`/devices/${id}`)}>
              Full Details
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={refresh}>
              Refresh
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      {(latestReading || avgVoltage > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}
        >
          {[
            { label: 'Latest Voltage', value: `${(latestReading?.voltage ?? 0).toFixed(2)} V`, icon: <Zap size={18} />, style: 'stat-card-voltage' },
            { label: 'Latest Current', value: `${(latestReading?.current ?? 0).toFixed(2)} A`, icon: <Activity size={18} />, style: 'stat-card-current' },
            { label: 'Latest Power', value: `${(latestReading?.power ?? 0).toFixed(2)} W`, icon: <TrendingUp size={18} />, style: 'stat-card-power' },
            { label: 'Avg Voltage', value: `${avgVoltage.toFixed(2)} V`, icon: <Battery size={18} />, style: 'stat-card-solar' },
            { label: 'Avg Current', value: `${avgCurrent.toFixed(2)} A`, icon: <Activity size={18} />, style: 'stat-card-solar' },
            { label: 'Microcontrollers', value: microcontrollers.length.toString(), icon: <Cpu size={18} />, style: 'stat-card-mc' },
          ].map(s => (
            <div key={s.label} className={`card ${s.style}`} style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', opacity: s.style ? 0.9 : 1 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', opacity: 0.8 }}>{s.label}</span>
                {s.icon}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Readings Chart */}
      {chartData.length > 0 && (
        <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="card-header">
            <div>
              <h2 className="section-title">Readings Overview</h2>
              <p className="section-desc">{readings.length} data points — latest 60 shown</p>
            </div>
            <Button variant="secondary" size="sm" leftIcon={<TrendingUp size={14} />} onClick={() => navigate(`/devices/${id}/history`)}>
              Full History
            </Button>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5E81AC" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#5E81AC" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3BE8C" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#A3BE8C" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="gW" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B48EAD" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#B48EAD" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface-primary)', border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: 13 }}
                />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
                <Area type="monotone" dataKey="voltage" stroke="#5E81AC" fill="url(#gV)" name="Voltage (V)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="current" stroke="#A3BE8C" fill="url(#gA)" name="Current (A)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="power" stroke="#B48EAD" fill="url(#gW)" name="Power (W)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* Microcontrollers & Sensors Hierarchy */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}>
        <div className="section-header">
          <div>
            <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} style={{ color: 'var(--mc-color)' }} />
              Connected Microcontrollers
            </h2>
            <p className="section-desc">{microcontrollers.length} microcontroller{microcontrollers.length !== 1 ? 's' : ''} connected · expand to see sensors</p>
          </div>
          <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAddMCModal(true)}>
            Assign Microcontroller
          </Button>
        </div>

        {microcontrollers.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', background: 'var(--mc-bg)', width: 'fit-content', margin: '0 auto 1rem', borderRadius: '50%' }}>
              <Cpu size={36} style={{ color: 'var(--mc-color)' }} />
            </div>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Microcontrollers Connected</h3>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>Connect an ESP32 or similar microcontroller to this solar device.</p>
            <Button variant="primary" leftIcon={<Plus size={14} />} onClick={() => setShowAddMCModal(true)}>
              Assign Microcontroller
            </Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {microcontrollers.map((mc, mcIdx) => (
              <MCCard
                key={mc.id}
                mc={mc}
                index={mcIdx}
                onToggle={() => toggleMC(mc.id)}
                onNavigate={() => navigate(`/devices/mc/${mc.id}`)}
                onSensorClick={(sensorId) => navigate(`/devices/${sensorId}`)}
                onRemove={removeMC}
              />
            ))}
          </div>
        )}
      </motion.div>

      <DeviceTokenModal isOpen={showTokenModal} token={generatedToken} onClose={() => { setShowTokenModal(false); setGeneratedToken(''); }} />
      <AddConnectedDeviceModal
        isOpen={showAddMCModal}
        onClose={() => setShowAddMCModal(false)}
        deviceId={id!}
        deviceTypes={deviceTypes}
        onSuccess={() => {
          setShowAddMCModal(false);
          refresh();
        }}
        onError={(msg) => alert(msg)}
      />
    </div>
  );
};
