import { useParams, useNavigate } from 'react-router-dom';
import { Activity, TrendingUp, X, AlertCircle, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { StatusBadge } from '../../components/Cards';
import { DeviceTokenModal } from '../../components/DeviceTokenModal';
import { UpdateDeviceModal } from '../../components/UpdateDeviceModal';
import { DeviceControlPanel } from '../../components/DeviceControlPanel';
import { DeviceInfoCard } from '../../components/DeviceInfoCard';
import { AddConnectedDeviceModal } from '../../components/AddConnectedDeviceModal';
import { useDeviceDetailData } from './hooks/useDeviceDetailData';

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
  const canControl = !!(deviceType?.features?.can_control);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/devices')}
          className="text-nord-8 hover:text-nord-9 hover:underline mb-4"
        >
          &larr; Back to Devices
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{device.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{device.type} &bull; {device.city}</p>
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
        <DeviceInfoCard
          device={device}
          status={getStatusType(device.device_state, deviceOnline)}
          latestReading={latestReading}
          onUpdate={openUpdateModal}
          onViewHistory={() => navigate(`/devices/${id}/state-history`)}
        />

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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connected Devices</h2>
              <button
                onClick={() => setShowAddConnectedModal(true)}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings size={16} />
                Add Device
              </button>
            </div>

            {connectedDevices.length > 0 ? (
              <div className="space-y-3">
                {connectedDevices.map((connectedDevice) => (
                  <div
                    key={connectedDevice.id}
                    onClick={() => handleConnectedDeviceClick(connectedDevice)}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{connectedDevice.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{connectedDevice.type} &bull; {connectedDevice.ip_address}</p>
                    </div>
                    <StatusBadge status={getStatusType(connectedDevice.device_state, false)} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No connected devices</p>
            )}
          </div>
        )}

        {/* Latest Reading - Shows connected device readings if available */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {(() => {
            const supportedDevices = connectedDevices.filter(d => d.hardware_type === 1);

            if (supportedDevices.length === 1) {
              const connectedDev = supportedDevices[0];
              return (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Latest Reading</h2>
                    <p className="text-xs text-primary-500 mt-1">From connected device: {connectedDev.name}</p>
                  </div>
                  {loadingSingleReading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : singleConnectedReading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-nord-3 dark:text-nord-4">Voltage</span>
                        <span className="text-2xl font-bold text-nord-8">{(singleConnectedReading.voltage ?? 0).toFixed(2)}V</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-nord-3 dark:text-nord-4">Current</span>
                        <span className="text-2xl font-bold text-success">{(singleConnectedReading.current ?? 0).toFixed(2)}A</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-nord-3 dark:text-nord-4">Power</span>
                        <span className="text-2xl font-bold text-nord-15">{(singleConnectedReading.power ?? 0).toFixed(2)}W</span>
                      </div>
                      {singleConnectedReading.temperature && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{singleConnectedReading.temperature.toFixed(1)}&deg;C</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(singleConnectedReading.timestamp).toLocaleString()}
                      </div>
                      <button
                        onClick={() => navigate(`/devices/${connectedDev.id}/history`)}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      >
                        <Activity size={16} />
                        See Older Readings
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No readings available from connected device</div>
                  )}
                </>
              );
            } else if (supportedDevices.length > 1) {
              return (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Connected Device Readings</h2>
                    <p className="text-xs text-text-secondary mt-1">{supportedDevices.length} devices with latest data</p>
                  </div>
                  {loadingMultipleReadings ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {supportedDevices.map((dev) => {
                        const reading = multipleConnectedReadings[dev.id];
                        const isExpanded = expandedDevices[dev.id];

                        return (
                          <div key={dev.id} className="border border-border-primary rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedDevices(prev => ({ ...prev, [dev.id]: !prev[dev.id] }))}
                              className="w-full px-4 py-3 bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                                  <Activity size={18} className="text-primary-500" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold text-text-primary">{dev.name}</h3>
                                  <p className="text-xs text-text-tertiary">{dev.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {reading && (
                                  <div className="text-right mr-2">
                                    <span className="text-xs font-semibold text-nord-8">{(reading.voltage ?? 0).toFixed(1)}V</span>
                                    <span className="text-xs text-text-tertiary mx-1">&bull;</span>
                                    <span className="text-xs font-semibold text-success">{(reading.current ?? 0).toFixed(2)}A</span>
                                    <span className="text-xs text-text-tertiary mx-1">&bull;</span>
                                    <span className="text-xs font-semibold text-nord-15">{(reading.power ?? 0).toFixed(1)}W</span>
                                  </div>
                                )}
                                <svg
                                  className={`w-5 h-5 text-text-secondary transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="px-4 py-3 bg-surface-primary border-t border-border-primary">
                                {reading ? (
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3">
                                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                        <p className="text-xs text-text-secondary mb-1">Voltage</p>
                                        <p className="text-lg font-bold text-nord-8">{(reading.voltage ?? 0).toFixed(2)}V</p>
                                      </div>
                                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                                        <p className="text-xs text-text-secondary mb-1">Current</p>
                                        <p className="text-lg font-bold text-success">{(reading.current ?? 0).toFixed(2)}A</p>
                                      </div>
                                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                                        <p className="text-xs text-text-secondary mb-1">Power</p>
                                        <p className="text-lg font-bold text-nord-15">{(reading.power ?? 0).toFixed(2)}W</p>
                                      </div>
                                    </div>
                                    {reading.temperature && (
                                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                                        <p className="text-xs text-text-secondary mb-1">Temperature</p>
                                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{reading.temperature.toFixed(1)}&deg;C</p>
                                      </div>
                                    )}
                                    <div className="text-xs text-text-tertiary">
                                      Last updated: {new Date(reading.timestamp).toLocaleString()}
                                    </div>
                                    <button
                                      onClick={() => navigate(`/devices/${dev.id}/history`)}
                                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
                                    >
                                      <Activity size={14} />
                                      View Full History
                                    </button>
                                  </div>
                                ) : (
                                  <div className="text-center py-4">
                                    <p className="text-text-secondary text-sm">No readings available</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              );
            } else {
              return (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Latest Reading</h2>
                  {latestReading ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-nord-3 dark:text-nord-4">Voltage</span>
                        <span className="text-2xl font-bold text-nord-8">{(latestReading.voltage ?? 0).toFixed(2)}V</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-nord-3 dark:text-nord-4">Current</span>
                        <span className="text-2xl font-bold text-success">{(latestReading.current ?? 0).toFixed(2)}A</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-nord-3 dark:text-nord-4">Power</span>
                        <span className="text-2xl font-bold text-nord-15">{(latestReading.power ?? 0).toFixed(2)}W</span>
                      </div>
                      {latestReading.temperature && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Temperature</span>
                          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{latestReading.temperature.toFixed(1)}&deg;C</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(latestReading.timestamp).toLocaleString()}
                      </div>
                      <button
                        onClick={() => navigate(`/devices/${id}/history`)}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                      >
                        <Activity size={16} />
                        See Older Readings
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">No readings available</div>
                  )}
                </>
              );
            }
          })()}
        </div>
      </div>

      {/* Averages */}
      {readings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`bg-gradient-to-br from-nord-9 to-nord-8 text-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 ${selectedMetric === 'voltage' ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-105'
              }`}
            onClick={() => setSelectedMetric(selectedMetric === 'voltage' ? 'all' : 'voltage')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-nord-4 text-sm">Average Voltage</p>
                <p className="text-3xl font-bold mt-1">{averages.voltage.toFixed(2)}V</p>
                {selectedMetric === 'voltage' && (
                  <p className="text-xs text-blue-200 mt-1">Click to show all metrics</p>
                )}
              </div>
              <Activity size={40} className="text-nord-5" />
            </div>
          </div>
          <div
            className={`bg-gradient-to-br from-success to-nord-14 text-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 ${selectedMetric === 'current' ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-105'
              }`}
            onClick={() => setSelectedMetric(selectedMetric === 'current' ? 'all' : 'current')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-nord-4 text-sm">Average Current</p>
                <p className="text-3xl font-bold mt-1">{averages.current.toFixed(2)}A</p>
                {selectedMetric === 'current' && (
                  <p className="text-xs text-blue-200 mt-1">Click to show all metrics</p>
                )}
              </div>
              <TrendingUp size={40} className="text-nord-5" />
            </div>
          </div>
          <div
            className={`bg-gradient-to-br from-nord-15 to-nord-9 text-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 ${selectedMetric === 'power' ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-105'
              }`}
            onClick={() => setSelectedMetric(selectedMetric === 'power' ? 'all' : 'power')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-nord-4 text-sm">Average Power</p>
                <p className="text-3xl font-bold mt-1">{averages.power.toFixed(2)}W</p>
                {selectedMetric === 'power' && (
                  <p className="text-xs text-blue-200 mt-1">Click to show all metrics</p>
                )}
              </div>
              <AlertCircle size={40} className="text-purple-200" />
            </div>
          </div>
        </div>
      )}

      {/* Main Aggregate Chart */}
      {readings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedDay ? `Detailed View - ${selectedDay}` : 'Aggregate Performance Chart'}
              {selectedMetric !== 'all' && (
                <span className="text-blue-600 dark:text-blue-400 ml-2">
                  ({selectedMetric === 'voltage' ? 'Voltage Only' :
                    selectedMetric === 'current' ? 'Current Only' : 'Power Only'})
                </span>
              )}
            </h2>
            {selectedDay && (
              <button
                onClick={() => setSelectedDay(null)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={16} />
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
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="time" stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)' }} />
              <YAxis stroke="var(--text-tertiary)" tick={{ fill: 'var(--text-tertiary)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface-primary)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  color: 'var(--text-primary)'
                }}
              />
              <Legend />
              {(selectedMetric === 'all' || selectedMetric === 'voltage') && (
                <Area type="monotone" dataKey="voltage" stroke="#5E81AC" fillOpacity={1} fill="url(#colorVoltage)" name="Voltage (V)" />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'current') && (
                <Area type="monotone" dataKey="current" stroke="#A3BE8C" fillOpacity={1} fill="url(#colorCurrent)" name="Current (A)" />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'power') && (
                <Area type="monotone" dataKey="power" stroke="#B48EAD" fillOpacity={1} fill="url(#colorPower)" name="Power (W)" />
              )}
              {selectedMetric !== 'all' && (
                <Line
                  type="monotone"
                  dataKey={`${selectedMetric}Avg`}
                  stroke="#3B82F6"
                  strokeWidth={3}
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
      {allReadings.length > 0 && !selectedDay && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Breakdown </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getDailyBreakdown().map((day) => (
              <div
                key={day.date}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={() => setSelectedDay(day.date)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{day.date}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{day.count} readings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg: {day.avgVoltage.toFixed(1)}V</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{day.avgCurrent.toFixed(2)}A</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{day.avgPower.toFixed(1)}W</p>
                    <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Click to zoom</p>
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
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
