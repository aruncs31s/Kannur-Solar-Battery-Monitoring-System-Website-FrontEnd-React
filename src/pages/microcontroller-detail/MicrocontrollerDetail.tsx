import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Sun, ArrowLeft, ChevronRight, Cpu } from 'lucide-react';
import { useDeviceDetailData } from '../device-detail/hooks/useDeviceDetailData';
import { UpdateDeviceModal } from '../../components/UpdateDeviceModal';
import { DeviceControlPanel } from '../../components/DeviceControlPanel';
import { DeviceInfoCard } from '../../components/DeviceInfoCard';
import { FirmwareBuilderModal, DeviceHeader } from '../../components';
import { DailyBreakdownCharts } from '../../components/DailyBreakdownCharts';
import { DeviceTokenModal } from '../../components/DeviceTokenModal';
import { ConnectedDeviceDTO } from '../../domain/entities/Device';
import { Reading } from '../../domain/entities/Reading';
import { HierarchyBreadcrumb } from '../../components/ui/HierarchyBreadcrumb';
import { DeviceTypeIcon } from '../../components/ui/DeviceTypeIcon';
import { DeviceStateBadge } from '../../components/ui/Badge';
import { ReadingMetricsCard } from '../../components/ui/ReadingMetricsCard';
import { httpClient } from '../../infrastructure/http/HttpClient';
import { devicesAPI } from '../../api/devices';
import { useParams } from 'react-router-dom';

export const MCDeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ── Shared hook (device data, readings, token, update modal, control, charts) ──
  const {
    device,
    loading,
    error,
    controlMessage,
    showTokenModal,
    generatedToken,
    showUpdateModal,
    updateForm,
    setUpdateForm,
    updateMessage,
    deviceTypes,
    deviceType,
    allReadings,
    selectedDay,
    setSelectedDay,
    generateToken,
    closeTokenModal,
    openUpdateModal,
    closeUpdateModal,
    handleUpdateDevice,
    controlDevice,
    getStatusType,
    isDeviceOnline,
    getLatestReading,
    loadDeviceData,
    loadReadings,
  } = useDeviceDetailData(id);


  // ── MC-specific: connected sensors ──
  const [connectedSensors, setConnectedSensors] = useState<ConnectedDeviceDTO[]>([]);
  const [sensorReadings, setSensorReadings] = useState<Record<number, Reading | null>>({});

  const [showFirmwareModal, setShowFirmwareModal] = useState(false);

  useEffect(() => {
    if (id) loadConnectedSensors();
  }, [id]);

  const loadConnectedSensors = async () => {
    if (!id) return;
    try {
      const resp = await httpClient.get<{ connected_devices: ConnectedDeviceDTO[] }>(`/devices/${id}/connected`);
      const sensors = resp.connected_devices || [];
      setConnectedSensors(sensors);

      const readingsMap: Record<number, Reading | null> = {};
      await Promise.all(
        sensors.map(async (s) => {
          try {
            const rr = await httpClient.get<{ readings: any[] }>(`/devices/${s.id}/readings/progressive`);
            const allRdings = rr.readings || [];
            const last = allRdings[allRdings.length - 1];
            readingsMap[s.id] = last
              ? {
                  id: `${s.id}-latest`,
                  deviceId: s.id.toString(),
                  voltage: last.voltage,
                  current: last.current,
                  avg_voltage: last.avg_voltage,
                  avg_current: last.avg_current,
                  power: (last.voltage || 0) * (last.current || 0),
                  timestamp: new Date(last.created_at).getTime(),
                }
              : null;
          } catch {
            readingsMap[s.id] = null;
          }
        })
      );
      setSensorReadings(readingsMap);
    } catch {
      /* no sensors */
    }
  };

  const generateFirmwareToken = async (): Promise<string> => {
    if (!id) throw new Error('Device ID not found');
    const response = await devicesAPI.generateDeviceToken(parseInt(id));
    return response.token;
  };


  const buildAndDownloadFirmware = async (config: any, deviceToken: string) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Please login to build firmware');
    if (!deviceToken) throw new Error('Please provide or generate a device token first');

    const response = await fetch('/api/codegen/build-and-download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...config, token: deviceToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Build failed');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.device_name || 'firmware'}.bin`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // ── Guard renders ──
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading device...</div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
        {error || 'Device not found'}
      </div>
    );
  }

  const latestReading = getLatestReading();
  const deviceOnline = isDeviceOnline();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.35rem 0.75rem', background: 'var(--surface-secondary)',
            border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 500,
          }}
        >
          <ArrowLeft size={14} /> Back
        </button>
        <HierarchyBreadcrumb
          items={[
            { label: 'Solar Devices', href: '/solar-devices', icon: <Sun size={12} /> },
            { label: device.name, icon: <Cpu size={12} /> },
          ]}
        />
        <span className="badge badge-micro"><Cpu size={10} /> Microcontroller</span>
      </div>

      <DeviceHeader
        device={device}
        deviceOnline={deviceOnline}
        latestReading={latestReading}
        onGenerateToken={generateToken}
        onBack={() => navigate('/devices')}
        onUpdate={openUpdateModal}
        onSettings={() => navigate(`/devices/${id}/settings`)}
      />

      {/* Control Message */}
      {controlMessage && (
        <div className={`p-4 rounded-lg ${controlMessage.includes('success') || controlMessage.includes('turned') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          {controlMessage}
        </div>
      )}

      {/* Modals */}
      <DeviceTokenModal isOpen={showTokenModal} token={generatedToken} onClose={closeTokenModal} />

      <UpdateDeviceModal
        isOpen={showUpdateModal}
        onClose={closeUpdateModal}
        onSubmit={handleUpdateDevice}
        formData={updateForm}
        onFormChange={setUpdateForm}
        deviceTypes={deviceTypes}
        message={updateMessage}
      />

      <FirmwareBuilderModal
        isOpen={showFirmwareModal}
        onClose={() => setShowFirmwareModal(false)}
        device={device}
        onBuildAndDownload={buildAndDownloadFirmware}
        onGenerateToken={generateFirmwareToken}
      />

      {/* Connected Sensors */}
      {connectedSensors.length > 0 && (
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Radio size={16} style={{ color: 'var(--sensor-color)' }} /> Connected Sensors
              </h2>
              <p className="section-desc">
                {connectedSensors.length} sensor{connectedSensors.length !== 1 ? 's' : ''} connected to this microcontroller
              </p>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {connectedSensors.map((sensor) => (
              <div key={sensor.id} style={{ border: '1px solid var(--border-secondary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <button
                  onClick={() => navigate(`/devices/${sensor.id}`)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem',
                    padding: '0.875rem 1rem', background: 'var(--surface-secondary)',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <DeviceTypeIcon hardwareType={sensor.hardware_type ?? 3} size={15} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{sensor.name}</span>
                    {sensor.type && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>· {sensor.type}</span>
                    )}
                  </div>
                  <DeviceStateBadge state={sensor.device_state} />
                  <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
                </button>

                {sensorReadings[sensor.id] ? (
                  <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--border-secondary)' }}>
                    <ReadingMetricsCard
                      voltage={sensorReadings[sensor.id]?.voltage}
                      current={sensorReadings[sensor.id]?.current}
                      power={sensorReadings[sensor.id]?.power}
                      updatedAt={sensorReadings[sensor.id]?.timestamp}
                      compact
                    />
                  </div>
                ) : (
                  <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border-secondary)' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No readings available yet</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Device Info */}
        <DeviceInfoCard
          device={device}
          status={getStatusType(device.device_state, deviceOnline)}
          latestReading={latestReading}
          onUpdate={openUpdateModal}
          onViewHistory={() => navigate(`/devices/${id}/state-history`)}
        />

        {/* Latest Reading */}
        {latestReading && (
          <div className="card">
            <div className="card-header">
              <h2 className="section-title">Latest Reading</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div className="metric-card">
                  <span className="metric-label" style={{ color: 'var(--nord-10)' }}>Voltage</span>
                  <span className="metric-value" style={{ color: 'var(--nord-10)' }}>{(latestReading.voltage ?? 0).toFixed(2)}V</span>
                </div>
                <div className="metric-card">
                  <span className="metric-label" style={{ color: 'var(--success)' }}>Current</span>
                  <span className="metric-value" style={{ color: 'var(--success)' }}>{(latestReading.current ?? 0).toFixed(2)}A</span>
                </div>
                <div className="metric-card">
                  <span className="metric-label" style={{ color: 'var(--nord-15)' }}>Power</span>
                  <span className="metric-value" style={{ color: 'var(--nord-15)' }}>{(latestReading.power ?? 0).toFixed(2)}W</span>
                </div>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'right' }}>
                {new Date(latestReading.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {/* Control Panel */}
        <DeviceControlPanel
          deviceState={device.device_state}
          canControl={deviceType?.features?.can_control || false}
          onControl={controlDevice}
          onRefresh={() => { loadDeviceData(); loadReadings(); }}
          onGenerateToken={generateToken}
        />
      </div>

      {/* Aggregate Chart — reuses hook's getDetailedChartData / getAggregateChartData via DailyBreakdownCharts */}
      <DailyBreakdownCharts
        allReadings={allReadings}
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
      />
    </div>
  );
};
