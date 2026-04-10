import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Activity, Zap, TrendingUp, Radio, ArrowRight } from 'lucide-react';
import { MicrocontrollerDTO } from '../domain/entities/Device';
import { DeviceStateBadge } from './ui/Badge';

interface MicrocontrollerCardProps {
  device: MicrocontrollerDTO;
  index?: number;
}

export const MicrocontrollerCard = ({ device, index = 0 }: MicrocontrollerCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: 12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2 }}
      className="card card-interactive group"
      onClick={() => navigate(`/devices/mc/${device.id}`)}
    >
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            <div style={{
              padding: '0.625rem',
              background: 'var(--mc-bg)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--mc-color)',
              flexShrink: 0,
            }}>
              <Cpu size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem' }}>
                {device.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>
                ID: #{device.id}
              </p>
            </div>
          </div>
          <DeviceStateBadge state={device.status?.toLowerCase() === 'active' || device.status?.toLowerCase() === 'online' ? 1 : 2} />
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <div style={{ padding: '0.625rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
              <TrendingUp size={11} /> Firmware
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'monospace' }}>
              v{device.firmware_version || '0.0.0'}
            </div>
          </div>
          <div style={{ padding: '0.625rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
              <Wifi size={11} /> MAC
            </div>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {device.mac_address || 'N/A'}
            </div>
          </div>
        </div>

        {/* IP Row */}
        {device.ip_address && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', background: 'var(--info-bg)', border: '1px solid var(--info-border)', borderRadius: 'var(--radius-md)', color: 'var(--info)' }}>
            <Zap size={14} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, fontFamily: 'monospace' }}>{device.ip_address}</span>
          </div>
        )}

        {/* Linked Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {device.used_by && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <Radio size={12} style={{ color: 'var(--text-muted)' }} />
              <span style={{ color: 'var(--text-muted)' }}>Assigned to:</span>
              <span style={{ fontWeight: 600 }}>{device.used_by}</span>
            </div>
          )}
          {device.connected_sensors && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--success)' }}>
              <Activity size={12} />
              <span style={{ fontWeight: 600 }}>Active Sensors Detected</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-accent)', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>Manage Device</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="badge badge-micro">
            <Cpu size={10} /> MCU
          </div>
        </div>
      </div>
    </motion.div>
  );
};
