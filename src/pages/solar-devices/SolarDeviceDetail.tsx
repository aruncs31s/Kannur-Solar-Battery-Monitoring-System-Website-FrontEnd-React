import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun, Cpu, Radio, ChevronDown, ChevronRight,
  ArrowLeft, Activity, Zap, RefreshCw,
  MapPin, Settings, AlertCircle, TrendingUp,
  Battery
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { httpClient } from '../../infrastructure/http/HttpClient';
import { DeviceResponseDTO, ConnectedDeviceDTO } from '../../domain/entities/Device';
import { Reading } from '../../domain/entities/Reading';
import { DeviceStateBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ReadingMetricsCard } from '../../components/ui/ReadingMetricsCard';
import { HierarchyBreadcrumb } from '../../components/ui/HierarchyBreadcrumb';
import { DeviceTypeIcon, isSensor } from '../../components/ui/DeviceTypeIcon';

import { DeviceTokenModal } from '../../components/DeviceTokenModal';

interface MCWithSensors extends ConnectedDeviceDTO {
  sensors: ConnectedDeviceDTO[];
  latestReading?: Reading | null;
  expanded: boolean;
}

export const SolarDeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [device, setDevice] = useState<DeviceResponseDTO | null>(null);
  const [microcontrollers, setMicrocontrollers] = useState<MCWithSensors[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');

  const loadDevice = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await httpClient.get<{ device: any }>(`/devices/${id}`);
      const d = resp.device;
      setDevice({
        id: d.id,
        name: d.name,
        type: d.type || '',
        ip_address: d.ip_address || d.details?.ip_address || '',
        mac_address: d.mac_address || d.details?.mac_address || '',
        firmware_version: d.firmware_version || '',
        version_id: d.version_id || 0,
        address: d.details?.address || '',
        city: d.details?.city || '',
        device_state: d.current_state || 1,
        hardware_type: d.device_type?.hardware_type ?? 4,
      });
    } catch (err: any) {
      setError('Failed to load device');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadHierarchy = useCallback(async () => {
    try {
      // Load connected devices (should be microcontrollers)
      const mcResp = await httpClient.get<{ connected_devices: ConnectedDeviceDTO[] }>(`/devices/${id}/connected`);
      const connectedDevices = mcResp.connected_devices || [];

      // For each MC, load its connected sensors
      const mcWithSensors: MCWithSensors[] = await Promise.all(
        connectedDevices.map(async (mc) => {
          let sensors: ConnectedDeviceDTO[] = [];
          let latestReading: Reading | null = null;

          try {
            const sensResp = await httpClient.get<{ connected_devices: ConnectedDeviceDTO[] }>(
              `/devices/${mc.id}/connected`
            );
            sensors = (sensResp.connected_devices || []).filter(d =>
              isSensor(d.hardware_type ?? 3) || (d.hardware_type === undefined)
            );
          } catch { /* MC may have no sensors yet */ }

          try {
            const readResp = await httpClient.get<{ readings: any[] }>(
              `/devices/${mc.id}/readings/progressive`
            );
            const rds = readResp.readings || [];
            if (rds.length > 0) {
              const last = rds[rds.length - 1];
              latestReading = {
                id: `${mc.id}-latest`,
                deviceId: mc.id.toString(),
                voltage: last.voltage,
                current: last.current,
                avg_voltage: last.avg_voltage,
                avg_current: last.avg_current,
                power: (last.voltage || 0) * (last.current || 0),
                timestamp: new Date(last.created_at).getTime(),
              };
            }
          } catch { /* no readings yet */ }

          return { ...mc, sensors, latestReading, expanded: connectedDevices.length === 1 };
        })
      );
      setMicrocontrollers(mcWithSensors);
    } catch (err: any) {
      // ignore, hierarchy may be empty
    }
  }, [id]);

  const loadReadings = useCallback(async () => {
    try {
      const resp = await httpClient.get<{ readings: any[] }>(`/devices/${id}/readings/progressive`);
      const rds = (resp.readings || []).map((r: any, idx: number) => ({
        id: `${id}-${idx}`,
        deviceId: id!,
        voltage: r.voltage,
        current: r.current,
        avg_voltage: r.avg_voltage,
        avg_current: r.avg_current,
        power: (r.voltage || 0) * (r.current || 0),
        timestamp: new Date(r.created_at).getTime(),
      }));
      setReadings(rds);
    } catch { /* no readings */ }
  }, [id]);

  useEffect(() => {
    loadDevice();
    loadHierarchy();
    loadReadings();
  }, [id, refreshKey]);

  const toggleMC = (mcId: number) => {
    setMicrocontrollers(prev =>
      prev.map(mc => mc.id === mcId ? { ...mc, expanded: !mc.expanded } : mc)
    );
  };

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
            <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={() => setRefreshKey(k => k + 1)}>
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
            { label: 'Microcontrollers', value: microcontrollers.length.toString(), icon: <Cpu size={18} />, style: '' },
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
          <Button variant="secondary" size="sm" leftIcon={<Settings size={14} />} onClick={() => navigate(`/devices/${id}`)}>
            Manage Connections
          </Button>
        </div>

        {microcontrollers.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', background: 'var(--mc-bg)', width: 'fit-content', margin: '0 auto 1rem', borderRadius: '50%' }}>
              <Cpu size={36} style={{ color: 'var(--mc-color)' }} />
            </div>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Microcontrollers Connected</h3>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: '1.25rem' }}>Connect an ESP32 or similar microcontroller to this solar device.</p>
            <Button variant="secondary" leftIcon={<Settings size={14} />} onClick={() => navigate(`/devices/${id}`)}>
              Go to Device Manager
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
              />
            ))}
          </div>
        )}
      </motion.div>

      <DeviceTokenModal isOpen={showTokenModal} token={generatedToken} onClose={() => { setShowTokenModal(false); setGeneratedToken(''); }} />
    </div>
  );
};

// ── Microcontroller Card ──────────────────────────────────────────────────
interface MCCardProps {
  mc: MCWithSensors;
  index: number;
  onToggle: () => void;
  onNavigate: () => void;
  onSensorClick: (id: number) => void;
}

const MCCard = ({ mc, index, onToggle, onNavigate, onSensorClick }: MCCardProps) => {
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* MC Header */}
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem 1.25rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ padding: '0.5rem', background: 'var(--mc-bg)', borderRadius: 'var(--radius-md)', color: 'var(--mc-color)', flexShrink: 0 }}>
          <Cpu size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>{mc.name}</span>
            <span className="badge badge-micro"><Cpu size={10} /> Microcontroller</span>
            <DeviceStateBadge state={mc.device_state} />
          </div>
          {mc.latestReading && (
            <div style={{ display: 'flex', gap: '0.875rem', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--nord-8)', fontWeight: 600 }}>
                {(mc.latestReading.voltage ?? 0).toFixed(2)}V
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                {(mc.latestReading.current ?? 0).toFixed(2)}A
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--nord-15)', fontWeight: 600 }}>
                {(mc.latestReading.power ?? 0).toFixed(2)}W
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {mc.sensors.length} sensor{mc.sensors.length !== 1 ? 's' : ''}
          </span>
          {mc.expanded
            ? <ChevronDown size={16} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s' }} />
            : <ChevronRight size={16} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s' }} />
          }
        </div>
      </button>

      {/* MC Details when expanded */}
      <AnimatePresence>
        {mc.expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border-secondary)' }}>
              {/* MC Info */}
              <div style={{ display: 'flex', gap: '1.5rem', padding: '1rem 0', flexWrap: 'wrap' }}>
                {mc.ip_address && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Zap size={12} /> {mc.ip_address}
                  </div>
                )}
                {mc.mac_address && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontFamily: 'monospace', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={12} /> {mc.mac_address}
                  </div>
                )}
                {mc.firmware_version && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <TrendingUp size={12} /> v{mc.firmware_version}
                  </div>
                )}
              </div>

              {/* Latest reading for this MC */}
              {mc.latestReading && (
                <div style={{ marginBottom: '1rem' }}>
                  <ReadingMetricsCard
                    voltage={mc.latestReading.voltage}
                    current={mc.latestReading.current}
                    power={mc.latestReading.power}
                    updatedAt={mc.latestReading.timestamp}
                    compact
                    title="Latest Reading"
                  />
                </div>
              )}

              {/* Sensors */}
              {mc.sensors.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Radio size={12} /> Sensors / Actuators
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {mc.sensors.map(sensor => (
                      <SensorRow
                        key={sensor.id}
                        sensor={sensor}
                        onClick={() => onSensorClick(sensor.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {mc.sensors.length === 0 && !mc.latestReading && (
                <div style={{ padding: '1rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No sensors connected to this microcontroller</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Button variant="secondary" size="sm" leftIcon={<Cpu size={13} />} onClick={onNavigate}>
                  View Detail
                </Button>
                <Button variant="ghost" size="sm" leftIcon={<Activity size={13} />} onClick={() => window.open(`/devices/${mc.id}/history`, '_blank')}>
                  Readings History
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ── Sensor Row ──────────────────────────────────────────────────────────
interface SensorRowProps {
  sensor: ConnectedDeviceDTO;
  onClick: () => void;
}

const SensorRow = ({ sensor, onClick }: SensorRowProps) => {
  const ht = sensor.hardware_type ?? 3;

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.625rem 0.875rem',
        background: 'var(--surface-secondary)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'left',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-tertiary)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-focus)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-secondary)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-secondary)'; }}
    >
      <DeviceTypeIcon hardwareType={ht} size={14} />
      <div style={{ flex: 1 }}>
        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{sensor.name}</span>
        {sensor.type && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>· {sensor.type}</span>}
      </div>
      <DeviceStateBadge state={sensor.device_state} />
      <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </button>
  );
};
