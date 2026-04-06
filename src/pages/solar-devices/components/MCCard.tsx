import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ChevronDown, ChevronRight, Zap, Activity, TrendingUp, Radio } from 'lucide-react';
import { DeviceStateBadge } from '../../../components/ui/Badge';
import { ReadingMetricsCard } from '../../../components/ui/ReadingMetricsCard';
import { Button } from '../../../components/ui/Button';
import { MCWithSensors } from '../types';
import { SensorRow } from './SensorRow';

export interface MCCardProps {
  mc: MCWithSensors;
  index: number;
  onToggle: () => void;
  onNavigate: () => void;
  onSensorClick: (id: number) => void;
}

export const MCCard = ({ mc, index, onToggle, onNavigate, onSensorClick }: MCCardProps) => {
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
