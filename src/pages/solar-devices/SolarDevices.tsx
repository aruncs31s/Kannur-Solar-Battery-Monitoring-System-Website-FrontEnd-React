import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  Sun, MapPin, Cpu, Activity, Plus, Search,
  Zap, TrendingUp, Filter, RefreshCw, AlertCircle
} from 'lucide-react';
import { httpClient } from '../../infrastructure/http/HttpClient';
import { DeviceResponseDTO } from '../../domain/entities/Device';
import { DeviceStateBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { AddSolarDeviceModal } from '../../components/AddSolarDeviceModal';

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: 'easeOut' as const },
  }),
};

export const SolarDevices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<DeviceResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadDevices();
  }, [refreshKey]);

  const loadDevices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await httpClient.get<{ devices: any[] }>('/devices/solar');
      const mapped: DeviceResponseDTO[] = (response.devices || []).map((d: any) => {
        const stateId = d.status || d.device_state || d.current_state || 0;
        return {
          id: d.id,
          name: d.name || '',
          type: d.type || '',
          ip_address: d.ip_address || '',
          mac_address: d.mac_address || '',
          firmware_version: d.firmware_version || '',
          version_id: d.version_id || 0,
          address: d.address || '',
          city: d.city || '',
          status: typeof stateId === 'number' ? stateId : parseInt(stateId) || 0,
          device_state: typeof stateId === 'number' ? stateId : parseInt(stateId) || 0,
          hardware_type: d.hardware_type || 4,
        };
      });
      setDevices(mapped);
    } catch (err: any) {
      setError('Failed to load solar devices');
    } finally {
      setLoading(false);
    }
  };

  const filtered = devices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.city || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchState =
      filterState === 'all' ? true :
      filterState === 'active' ? d.status === 1 :
      d.status !== 1;
    return matchSearch && matchState;
  });

  const stats = {
    total: devices.length,
    active: devices.filter(d => d.status === 1).length,
    inactive: devices.filter(d => d.status !== 1).length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <div style={{ padding: '0.6rem', background: 'var(--solar-bg)', borderRadius: 'var(--radius-lg)', color: 'var(--solar-color)' }}>
              <Sun size={22} />
            </div>
            <h1 className="page-title">Solar Devices</h1>
          </div>
          <p className="page-subtitle">MPPT solar chargers and energy harvesting devices</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />} onClick={() => setRefreshKey(k => k + 1)}>
            Refresh
          </Button>
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
            Add Solar Device
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {[
          { label: 'Total Devices', value: stats.total, icon: <Sun size={20} />, color: 'var(--solar-color)', bg: 'var(--solar-bg)' },
          { label: 'Active', value: stats.active, icon: <Activity size={20} />, color: 'var(--success)', bg: 'var(--success-bg)' },
          { label: 'Inactive', value: stats.inactive, icon: <AlertCircle size={20} />, color: 'var(--text-muted)', bg: 'var(--surface-tertiary)' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.65rem', background: stat.bg, borderRadius: 'var(--radius-md)', color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter Bar */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by name or city..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Filter size={14} style={{ alignSelf: 'center', color: 'var(--text-muted)' }} />
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterState(f)}
              className={`btn btn-sm ${filterState === f ? 'btn-primary' : 'btn-ghost'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-md)', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Device Cards Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ height: 200, padding: '1.5rem' }}>
              <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: '0.75rem' }} />
              <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: '1.5rem' }} />
              <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: '0.5rem' }} />
              <div className="skeleton" style={{ height: 14, width: '50%' }} />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <div style={{ padding: '1rem', background: 'var(--solar-bg)', width: 'fit-content', margin: '0 auto 1rem', borderRadius: '50%' }}>
            <Sun size={40} style={{ color: 'var(--solar-color)' }} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {devices.length === 0 ? 'No Solar Devices Yet' : 'No results found'}
          </h3>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem' }}>
            {devices.length === 0 ? 'Add your first MPPT solar charger to get started.' : 'Try adjusting your search or filter.'}
          </p>
          {devices.length === 0 && (
            <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setShowAddModal(true)}>
              Add Solar Device
            </Button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {filtered.map((device, i) => (
            <SolarDeviceCard
              key={device.id}
              device={device}
              index={i}
              onClick={() => navigate(`/solar-devices/${device.id}`)}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddSolarDeviceModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onDeviceAdded={() => { setShowAddModal(false); setRefreshKey(k => k + 1); }}
          onError={() => {}}
          onSuccess={() => { setRefreshKey(k => k + 1); }}
        />
      )}
    </div>
  );
};

interface SolarDeviceCardProps {
  device: DeviceResponseDTO;
  index: number;
  onClick: () => void;
}

const SolarDeviceCard = ({ device, index, onClick }: SolarDeviceCardProps) => {
  const isActive = device.status === 1;

  return (
    <motion.div
      custom={index}
      variants={CARD_VARIANTS}
      initial="hidden"
      animate="visible"
      className="card card-interactive"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
            <div style={{
              padding: '0.6rem',
              background: isActive ? 'var(--solar-bg)' : 'var(--surface-tertiary)',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--solar-color)' : 'var(--text-muted)',
              flexShrink: 0,
            }}>
              <Sun size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '1rem' }}>
                {device.name}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '0.1rem' }}>
                {device.type || 'Solar Charger'}
              </p>
            </div>
          </div>
          <DeviceStateBadge state={device.status} />
        </div>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {device.city && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <MapPin size={13} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
              {device.city}
            </div>
          )}
          {device.ip_address && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              <Zap size={13} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
              {device.ip_address}
            </div>
          )}
          {device.firmware_version && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              <TrendingUp size={13} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
              v{device.firmware_version}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Cpu size={12} />
            <span>Click to view microcontrollers & sensors</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-accent)', fontWeight: 600 }}>#{device.id}</span>
        </div>
      </div>
    </motion.div>
  );
};
