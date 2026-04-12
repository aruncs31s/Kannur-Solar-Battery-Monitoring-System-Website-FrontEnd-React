import { useParams, useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, X, Settings, MapPin, ArrowLeft, Zap, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { StatusBadge } from '../../components/Cards';
import { DeviceTokenModal } from '../../components/DeviceTokenModal';
import { UpdateDeviceModal } from '../../components/UpdateDeviceModal';
import { DeviceControlPanel } from '../../components/DeviceControlPanel';
import { DeviceInfoCard } from '../../components/DeviceInfoCard';
import { AddConnectedDeviceModal } from '../../components/AddConnectedDeviceModal';
import { DeviceOwnershipCard } from './components/DeviceOwnershipCard';
import { TransferOwnershipModal } from '../../components/TransferOwnershipModal';
import { useDeviceDetailData } from './hooks/useDeviceDetailData';
import { useAuthStore } from '../../store/authStore';

export const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    device,
    readings,
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
    connectedDevices,
    showAddConnectedModal,
    setShowAddConnectedModal,
    selectedConnectedDevice,
    showConnectedReadingsModal,
    connectedDeviceReadings,
    loadingConnectedReadings,
    singleConnectedReading,
    multipleConnectedReadings,
    expandedDevices,
    setExpandedDevices,
    loadingSingleReading,
    loadingMultipleReadings,
    ownership,
    loadingOwnership,
    showTransferModal,
    setShowTransferModal,
    handleTransferOwnership,
    handleToggleVisibility,
    allReadings,
    selectedDay,
    setSelectedDay,
    selectedMetric,
    setSelectedMetric,
    generateToken,
    closeTokenModal,
    openUpdateModal,
    closeUpdateModal,
    handleUpdateDevice,
    controlDevice,
    getStatusType,
    isDeviceOnline,
    getLatestReading,
    getAverages,
    getAggregateChartData,
    getDailyBreakdown,
    getDetailedChartData,
    loadConnectedDevices,
    handleConnectedDeviceClick,
    closeConnectedReadingsModal,
    loadDeviceData,
    loadReadings,
    setControlMessage
  } = useDeviceDetailData(id);

  const { user: currentUser } = useAuthStore();
  const canEditOwnership = currentUser?.role === 'admin' || (device && ownership && parseInt(currentUser?.id || '0') === ownership.owner_id);

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
  const averages = getAverages();
  const deviceOnline = isDeviceOnline();
  const resolvedDeviceType = deviceType || deviceTypes.find((type) => type.name === device?.type) || null;
  const canControl = !!(resolvedDeviceType?.features?.can_control);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <button
          onClick={() => navigate('/devices')}
          className="w-fit flex items-center gap-1.5 text-text-accent hover:text-nord-10 transition-colors mb-2 text-sm font-medium"
        >
          <ArrowLeft size={14} /> Back to Devices
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight flex items-center gap-2">{device.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-text-secondary font-medium">{device.type}</span>
              <span className="text-text-muted opacity-40">&bull;</span>
              <span className="text-text-tertiary flex items-center gap-1">
                <MapPin size={12} /> {device.city}
              </span>
            </div>
          </div>
          {(canEditOwnership || (canControl)) && (
            <button 
              onClick={() => navigate(`/devices/${id}/settings`)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-secondary hover:bg-surface-tertiary border border-border-primary text-text-primary rounded-lg transition-colors font-medium text-sm shadow-sm"
            >
              <Settings size={16} className="text-text-secondary" />
              Settings
            </button>
          )}
        </div>
      </div>

      {/* Control Message */}
      {controlMessage && (
        <div className={`p-4 rounded-lg ${controlMessage.includes('success') || controlMessage.includes('turned') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          {controlMessage}
        </div>
      )}

      {/* Token Modal (reusable component) */}
      <DeviceTokenModal
        isOpen={showTokenModal}
        token={generatedToken}
        onClose={closeTokenModal}
      />

      {/* Update Device Modal (reusable component) */}
      <UpdateDeviceModal
        isOpen={showUpdateModal}
        onClose={closeUpdateModal}
        onSubmit={handleUpdateDevice}
        formData={updateForm}
        onFormChange={setUpdateForm}
        deviceTypes={deviceTypes}
        message={updateMessage}
      />

      {/* Add Connected Device Modal */}
      <AddConnectedDeviceModal
        isOpen={showAddConnectedModal}
        onClose={() => setShowAddConnectedModal(false)}
        deviceId={id!}
        deviceTypes={deviceTypes}
        onSuccess={(msg) => {
          setControlMessage(msg);
          setTimeout(() => setControlMessage(''), 3000);
          loadConnectedDevices();
        }}
        onError={(msg) => {
          setControlMessage(msg);
          setTimeout(() => setControlMessage(''), 3000);
        }}
      />

      {/* Connected Device Readings Modal */}
      {showConnectedReadingsModal && selectedConnectedDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-text-primary">{selectedConnectedDevice.name}</h3>
                <p className="text-sm text-text-secondary mt-1">{selectedConnectedDevice.type}</p>
              </div>
              <button
                onClick={closeConnectedReadingsModal}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {loadingConnectedReadings ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                </div>
              ) : connectedDeviceReadings.length > 0 ? (
                <div className="bg-surface-secondary rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-text-secondary mb-3">Latest Readings</h4>
                  <div className="space-y-3">
                    {connectedDeviceReadings.map((reading) => (
                      <div key={reading.id} className="flex items-center justify-between border-b border-border-primary pb-2 last:border-0">
                        <div className="flex-1">
                          <p className="text-xs text-text-tertiary">
                            {new Date(reading.timestamp).toLocaleString()}
                          </p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-sm text-text-primary">
                              <span className="font-semibold text-nord-8">{(reading.voltage ?? 0).toFixed(2)}V</span>
                            </span>
                            <span className="text-sm text-text-primary">
                              <span className="font-semibold text-success">{(reading.current ?? 0).toFixed(2)}A</span>
                            </span>
                            <span className="text-sm text-text-primary">
                              <span className="font-semibold text-nord-15">{(reading.power ?? 0).toFixed(2)}W</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="mx-auto text-gray-400 mb-4" size={48} />
                  <h3 className="text-lg font-semibold text-text-primary mb-2">No Readings Available</h3>
                  <p className="text-text-secondary">This device hasn't sent any readings yet.</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border-primary flex justify-end gap-3">
              <button
                onClick={closeConnectedReadingsModal}
                className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => navigate(`/devices/${selectedConnectedDevice.id}`)}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Settings size={16} />
                View Device Page
              </button>
              <button
                onClick={() => navigate(`/devices/${selectedConnectedDevice.id}/history`)}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Activity size={16} />
                View Full Readings
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Device Info (reusable component) */}
        <div className="space-y-6">
          <DeviceInfoCard
            device={device}
            status={getStatusType(device.device_state, deviceOnline)}
            latestReading={latestReading}
            onUpdate={openUpdateModal}
            onViewHistory={() => navigate(`/devices/${id}/state-history`)}
          />

          <DeviceOwnershipCard
            ownership={ownership}
            loading={loadingOwnership}
            onTransferClick={() => setShowTransferModal(true)}
            onVisibilityToggle={handleToggleVisibility}
            onViewHistory={() => navigate(`/devices/${id}/transfer-history`)}
            canEdit={!!canEditOwnership}
          />
        </div>

        {/* Control Panel or Connected Devices */}
        {canControl ? (
          <DeviceControlPanel
            deviceState={device.device_state}
            canControl={canControl}
            onControl={controlDevice}
            onRefresh={() => { loadDeviceData(); loadReadings(); }}
            onGenerateToken={generateToken}
          />
        ) : (
          <div className="card shadow-sm">
            <div className="card-header border-b-0 pb-0">
              <h2 className="section-title">Connected Devices</h2>
              <button
                onClick={() => setShowAddConnectedModal(true)}
                className="btn btn-primary btn-sm"
              >
                <Settings size={14} />
                Add Device
              </button>
            </div>

            <div className="card-body">
              {connectedDevices.length > 0 ? (
                <div className="space-y-3">
                  {connectedDevices.map((connectedDevice) => (
                    <div
                      key={connectedDevice.id}
                      onClick={() => handleConnectedDeviceClick(connectedDevice)}
                      className="flex items-center justify-between p-3 bg-surface-secondary border border-border-secondary rounded-lg cursor-pointer hover:bg-surface-tertiary transition-all duration-200"
                    >
                      <div>
                        <h3 className="font-semibold text-text-primary">{connectedDevice.name}</h3>
                        <p className="text-xs text-text-tertiary mt-0.5">{connectedDevice.type} &bull; {connectedDevice.ip_address}</p>
                      </div>
                      <StatusBadge status={getStatusType(connectedDevice.device_state, false)} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Cpu size={32} className="mx-auto text-text-muted mb-2 opacity-50" />
                  <p className="text-text-tertiary text-sm italic">No connected devices</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Latest Reading - Shows connected device readings if available */}
        <div className="card shadow-sm">
          {(() => {
            const supportedDevices = connectedDevices.filter(d => d.hardware_type === 1);

            if (supportedDevices.length === 1) {
              const connectedDev = supportedDevices[0];
              return (
                <div className="card-body">
                  <div className="mb-6">
                    <h2 className="section-title">Latest Reading</h2>
                    <p className="text-xs text-text-accent mt-1">From connected device: {connectedDev.name}</p>
                  </div>
                  {loadingSingleReading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : singleConnectedReading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border-secondary">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Voltage</span>
                        <span className="text-2xl font-bold text-nord-10">{(singleConnectedReading.voltage ?? 0).toFixed(2)}V</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border-secondary">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Current</span>
                        <span className="text-2xl font-bold text-success">{(singleConnectedReading.current ?? 0).toFixed(2)}A</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border-secondary">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Power</span>
                        <span className="text-2xl font-bold text-nord-15">{(singleConnectedReading.power ?? 0).toFixed(2)}W</span>
                      </div>
                      {singleConnectedReading.temperature && (
                        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border-secondary">
                          <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Temperature</span>
                          <span className="text-2xl font-bold text-orange-500">{singleConnectedReading.temperature.toFixed(1)}&deg;C</span>
                        </div>
                      )}
                      <div className="text-[0.7rem] text-text-muted mt-2 text-right">
                        Last sync: {new Date(singleConnectedReading.timestamp).toLocaleString()}
                      </div>
                      <button
                        onClick={() => navigate(`/devices/${connectedDev.id}/history`)}
                        className="mt-4 w-full btn btn-primary py-2.5"
                      >
                        <Activity size={16} />
                        See Older Readings
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-text-tertiary text-sm italic">No readings available from connected device</p>
                    </div>
                  )}
                </div>
              );
            } else if (supportedDevices.length > 1) {
              return (
                <div className="card-body">
                  <div className="mb-6">
                    <h2 className="section-title">Connected Device Readings</h2>
                    <p className="text-xs text-text-secondary mt-1">{supportedDevices.length} devices with latest data</p>
                  </div>
                  {loadingMultipleReadings ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {supportedDevices.map((dev) => {
                        const reading = multipleConnectedReadings[dev.id];
                        const isExpanded = expandedDevices[dev.id];

                        return (
                          <div key={dev.id} className="border border-border-secondary rounded-lg overflow-hidden transition-all duration-200">
                            <button
                              onClick={() => setExpandedDevices(prev => ({ ...prev, [dev.id]: !prev[dev.id] }))}
                              className="w-full px-4 py-3 bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Activity size={18} className="text-text-accent" />
                                <div className="text-left">
                                  <h3 className="font-semibold text-text-primary text-sm">{dev.name}</h3>
                                  <p className="text-[0.7rem] text-text-tertiary">{dev.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {reading && (
                                  <div className="hidden sm:flex items-center gap-2 mr-2">
                                    <span className="text-xs font-bold text-nord-10">{(reading.voltage ?? 0).toFixed(1)}V</span>
                                    <span className="text-xs font-bold text-success">{(reading.current ?? 0).toFixed(2)}A</span>
                                  </div>
                                )}
                                <svg
                                  className={`w-5 h-5 text-text-muted transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="px-4 py-4 bg-surface-primary border-t border-border-secondary">
                                {reading ? (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                      <div className="bg-surface-secondary border border-border-secondary rounded-lg p-3">
                                        <p className="text-[0.65rem] font-bold text-text-tertiary uppercase mb-1">Voltage</p>
                                        <p className="text-lg font-bold text-nord-10">{(reading.voltage ?? 0).toFixed(2)}V</p>
                                      </div>
                                      <div className="bg-surface-secondary border border-border-secondary rounded-lg p-3">
                                        <p className="text-[0.65rem] font-bold text-text-tertiary uppercase mb-1">Current</p>
                                        <p className="text-lg font-bold text-success">{(reading.current ?? 0).toFixed(2)}A</p>
                                      </div>
                                      <div className="bg-surface-secondary border border-border-secondary rounded-lg p-3">
                                        <p className="text-[0.65rem] font-bold text-text-tertiary uppercase mb-1">Power</p>
                                        <p className="text-lg font-bold text-nord-15">{(reading.power ?? 0).toFixed(1)}W</p>
                                      </div>
                                    </div>
                                    {reading.temperature && (
                                      <div className="bg-surface-secondary border border-border-secondary rounded-lg p-3">
                                        <p className="text-[0.65rem] font-bold text-text-tertiary uppercase mb-1">Temperature</p>
                                        <p className="text-lg font-bold text-orange-500">{reading.temperature.toFixed(1)}&deg;C</p>
                                      </div>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="text-[0.65rem] text-text-tertiary italic">
                                        Last sync: {new Date(reading.timestamp).toLocaleString()}
                                      </div>
                                      <button
                                        onClick={() => navigate(`/devices/${dev.id}/history`)}
                                        className="btn btn-primary btn-sm px-4"
                                      >
                                        <Activity size={14} />
                                        Full History
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <p className="text-text-tertiary text-sm italic">No recent readings for this device</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <div className="card-body">
                  <h2 className="section-title mb-6">Latest Reading</h2>
                  {latestReading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border-secondary">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Voltage</span>
                        <span className="text-2xl font-bold text-nord-10">{(latestReading.voltage ?? 0).toFixed(2)}V</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border-secondary">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Current</span>
                        <span className="text-2xl font-bold text-success">{(latestReading.current ?? 0).toFixed(2)}A</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border-secondary">
                        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Power</span>
                        <span className="text-2xl font-bold text-nord-15">{(latestReading.power ?? 0).toFixed(2)}W</span>
                      </div>
                      {latestReading.temperature && (
                        <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg border border-border-secondary">
                          <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Temperature</span>
                          <span className="text-2xl font-bold text-orange-500">{latestReading.temperature.toFixed(1)}&deg;C</span>
                        </div>
                      )}
                      <div className="text-[0.7rem] text-text-muted mt-2 text-right">
                        Last sync: {new Date(latestReading.timestamp).toLocaleString()}
                      </div>
                      <button
                        onClick={() => navigate(`/devices/${id}/history`)}
                        className="mt-4 w-full btn btn-primary py-2.5"
                      >
                        <Activity size={16} />
                        See Older Readings
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Activity className="mx-auto text-text-muted mb-4 opacity-10" size={48} />
                      <p className="text-text-tertiary text-sm italic">No readings available</p>
                    </div>
                  )}
                </div>
              );
            }
          })()}
        </div>
      </div>

      {/* Averages */}
      {(readings.length > 0 || allReadings.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className={`stat-card-voltage rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 ${selectedMetric === 'voltage' ? 'ring-2 ring-nord-8 ring-offset-2 dark:ring-offset-bg-primary' : ''
              }`}
            onClick={() => setSelectedMetric(selectedMetric === 'voltage' ? 'all' : 'voltage')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Average Voltage</p>
                <p className="text-3xl font-bold mt-1">{averages.voltage.toFixed(2)}V</p>
                {selectedMetric === 'voltage' && (
                  <p className="text-xs text-white/60 mt-2">Showing only voltage on chart</p>
                )}
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Activity size={24} className="text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={`stat-card-current rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 ${selectedMetric === 'current' ? 'ring-2 ring-nord-14 ring-offset-2 dark:ring-offset-bg-primary' : ''
              }`}
            onClick={() => setSelectedMetric(selectedMetric === 'current' ? 'all' : 'current')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Average Current</p>
                <p className="text-3xl font-bold mt-1">{averages.current.toFixed(2)}A</p>
                {selectedMetric === 'current' && (
                  <p className="text-xs text-white/60 mt-2">Showing only current on chart</p>
                )}
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className={`stat-card-power rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 ${selectedMetric === 'power' ? 'ring-2 ring-nord-15 ring-offset-2 dark:ring-offset-bg-primary' : ''
              }`}
            onClick={() => setSelectedMetric(selectedMetric === 'power' ? 'all' : 'power')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-xs font-semibold uppercase tracking-wider">Average Power</p>
                <p className="text-3xl font-bold mt-1">{averages.power.toFixed(2)}W</p>
                {selectedMetric === 'power' && (
                  <p className="text-xs text-white/60 mt-2">Showing only power on chart</p>
                )}
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Zap size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Aggregate Chart */}
      {(readings.length > 0 || allReadings.length > 0) && (
        <div className="card shadow-sm p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title text-2xl">
                {selectedDay ? `Detailed View - ${selectedDay}` : 'Aggregate Performance Chart'}
              </h2>
              {selectedMetric !== 'all' && (
                <p className="text-text-accent text-sm mt-1 font-medium italic">
                  Filtering by: {selectedMetric === 'voltage' ? 'Voltage Only' :
                    selectedMetric === 'current' ? 'Current Only' : 'Power Only'}
                </p>
              )}
            </div>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="btn btn-secondary btn-sm"
              >
                <X size={14} />
                Back to Overview
              </button>
            )}
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={selectedDay ? getDetailedChartData() : getAggregateChartData()}>
              <defs>
                <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5E81AC" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#5E81AC" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A3BE8C" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#A3BE8C" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B48EAD" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#B48EAD" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" opacity={0.6} />
              <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface-primary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  color: 'var(--text-primary)',
                  fontSize: '13px'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              {(selectedMetric === 'all' || selectedMetric === 'voltage') && (
                <Area type="monotone" dataKey="voltage" stroke="#5E81AC" strokeWidth={2} fillOpacity={1} fill="url(#colorVoltage)" name="Voltage (V)" dot={false} />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'current') && (
                <Area type="monotone" dataKey="current" stroke="#A3BE8C" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" name="Current (A)" dot={false} />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'power') && (
                <Area type="monotone" dataKey="power" stroke="#B48EAD" strokeWidth={2} fillOpacity={1} fill="url(#colorPower)" name="Power (W)" dot={false} />
              )}
              {selectedMetric !== 'all' && (
                <Line
                  type="monotone"
                  dataKey={`${selectedMetric}Avg`}
                  stroke="var(--text-accent)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name={`Avg ${selectedMetric === 'voltage' ? 'Voltage' : selectedMetric === 'current' ? 'Current' : 'Power'}`}
                  connectNulls={false}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily Breakdown Charts */}
      <div className="space-y-6">
        <h2 className="section-title text-2xl">Daily Breakdown</h2>
        {allReadings.length > 0 && !selectedDay ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getDailyBreakdown().map((day) => (
              <motion.div
                key={day.date}
                whileHover={{ y: -4 }}
                className="card card-interactive p-6"
                onClick={() => {
                  setSelectedDay(day.date);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-text-primary">{day.date}</h3>
                    <p className="text-xs text-text-tertiary">{day.count} readings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.7rem] font-bold text-nord-10">{day.avgVoltage.toFixed(1)}V</p>
                    <p className="text-[0.7rem] font-bold text-success">{day.avgCurrent.toFixed(2)}A</p>
                    <p className="text-[0.7rem] font-bold text-nord-15">{day.avgPower.toFixed(1)}W</p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={day.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                    <XAxis dataKey="time" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
                    <YAxis stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--surface-primary)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgb(0 0 0 / 0.1)',
                        color: 'var(--text-primary)',
                        fontSize: '12px'
                      }}
                    />
                    <Line type="monotone" dataKey="voltage" stroke="#5E81AC" strokeWidth={2} dot={false} name="V" />
                    <Line type="monotone" dataKey="current" stroke="#A3BE8C" strokeWidth={2} dot={false} name="A" />
                    <Line type="monotone" dataKey="power" stroke="#B48EAD" strokeWidth={2} dot={false} name="W" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            ))}
          </div>
        ) : selectedDay ? (
          <div className="card p-8 text-center bg-gradient-to-br from-surface-secondary to-surface-primary border-primary-500/20">
            <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary-500/20">
              <TrendingUp size={32} className="text-text-accent" />
            </div>
            <h3 className="text-xl font-bold text-text-primary">Viewing Details for {selectedDay}</h3>
            <p className="text-text-tertiary max-w-md mx-auto mb-6 mt-1">Check the main aggregate chart above to visualize the detailed hourly performance for this specific date.</p>
            <button
              onClick={() => {
                setSelectedDay(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn btn-primary px-8"
            >
              <ArrowLeft size={16} />
              Return to Overview
            </button>
          </div>
        ) : null}
      </div>

      <TransferOwnershipModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransfer={handleTransferOwnership}
        deviceName={device.name}
      />

    </div>
  );
};
