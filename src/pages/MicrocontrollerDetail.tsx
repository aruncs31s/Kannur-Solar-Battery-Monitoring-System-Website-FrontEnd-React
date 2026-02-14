import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity, X } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { readingsAPI } from '../api/readings';
import { devicesAPI } from '../api/devices';
import { UpdateDeviceModal } from '../components/UpdateDeviceModal';
import { DeviceControlPanel } from '../components/DeviceControlPanel';
import { DeviceInfoCard } from '../components/DeviceInfoCard';
import { FirmwareUploadModal, OnlineFirmwareBuilder, OTAFirmwareUpload, Codegen, DeviceHeader, FirmwareBuilderModal } from '../components';
import { DailyBreakdownCharts } from '../components/DailyBreakdownCharts';
import { DeviceTokenModal } from '../components/DeviceTokenModal';
import { DeviceTypeDTO } from '../domain/entities/Device';
import { Reading } from '../domain/entities/Reading';

interface DeviceInfo {
  id: number;
  name: string;
  type: string;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  address: string;
  city: string;
  device_state: number;
}

export const MCDeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [controlMessage, setControlMessage] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [readingsLimit] = useState(20);

  // Firmware builder state
  const [showFirmwareModal, setShowFirmwareModal] = useState(false);

  // Firmware upload state
  const [isFirmwareUploadModalOpen, setIsFirmwareUploadModalOpen] = useState(false);
  const [isOnlineBuilderOpen, setIsOnlineBuilderOpen] = useState(false);
  const [isOTAUploadOpen, setIsOTAUploadOpen] = useState(false);
  
  // Update device modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    name: '',
    type: 1,
    ip_address: '',
    mac_address: '',
    firmware_version_id: 1,
    address: '',
    city: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeDTO[]>([]);
  
  // Computed device type based on device.type matching deviceTypes
  const deviceType = device ? deviceTypes.find(type => type.name === device.type) : null;
  
  
  // Date picker state - default to today
  const getDefaultDates = () => {
    const today = new Date();
    return {
      start: today.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [startDate] = useState(defaultDates.start);
  const [endDate] = useState(defaultDates.end);
  const [useDateFilter] = useState(false); // Default to disabled to show all readings
  const [allReadings, setAllReadings] = useState<Reading[]>([]); // Store all readings for breakdown
  const [selectedDay, setSelectedDay] = useState<string | null>(null); // For zooming into daily view




  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (id) {
      loadDeviceData();
      loadReadings();
      loadDeviceTypes();
      
      // Auto-refresh every 30 seconds
      intervalId = setInterval(() => {
        if (isMounted) {
          loadDeviceData();
          loadReadings();
        }
      }, 30000);
    }
      
    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, readingsLimit, startDate, endDate, useDateFilter]);

  const loadDeviceTypes = async () => {
    try {
      const data = await devicesAPI.getDeviceTypes();
      setDeviceTypes(data);
    } catch (err) {
      console.error('Failed to load device types:', err);
    }
  };

  const loadDeviceData = async () => {
    try {
      const data = await devicesAPI.getDevice(id!);
      setDevice(data.device);
      setError('');
    } catch (err) {
      setError('Failed to load device information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReadings = async () => {
    if (!id) return;
    
    try {
      let data: Reading[];
      
      if (useDateFilter) {
        // Fetch readings by date range for display
        console.log('Fetching readings for date range:', startDate, 'to', endDate);
        data = await readingsAPI.getByDateRange({
          deviceId: id,
          startDate: startDate,
          endDate: endDate
        });
        console.log('Received readings:', data.length);
      } else {
        // Fetch all readings
        console.log('Fetching all readings');
        data = await readingsAPI.getByDevice(id);
        console.log('Received readings:', data.length);
      }
      
      // Sort by timestamp descending (newest first)
      const sortedReadings = data.sort((a, b) => b.timestamp - a.timestamp);
      
      // Always keep at least 10 readings for online status check
      const minReadings = Math.max(readingsLimit, 10);
      setReadings(sortedReadings.slice(0, minReadings));

      // Also fetch last 7 days for breakdown charts
      const last7DaysEnd = new Date();
      last7DaysEnd.setDate(last7DaysEnd.getDate() + 1); // Include tomorrow to be safe
      const last7DaysStart = new Date();
      last7DaysStart.setDate(last7DaysStart.getDate() - 7);
      
      console.log('Fetching breakdown data from:', last7DaysStart.toISOString().split('T')[0], 'to:', last7DaysEnd.toISOString().split('T')[0]);
      const breakdownData = await readingsAPI.getByDateRange({
        deviceId: id,
        startDate: last7DaysStart.toISOString().split('T')[0],
        endDate: last7DaysEnd.toISOString().split('T')[0]
      });
      console.log('Breakdown data (last 7 days):', breakdownData.length);
      if (breakdownData.length > 0) {
        console.log('Sample breakdown data:', breakdownData.slice(0, 3));
      }
      setAllReadings(breakdownData);
    } catch (err) {
      console.error('Failed to load readings:', err);
    }
  };

  const generateToken = async () => {
    if (!id) return;
    
    try {
      const response = await devicesAPI.generateDeviceToken(parseInt(id));
      setGeneratedToken(response.token);
      setShowTokenModal(true);
    } catch (err: any) {
      setControlMessage('Failed to generate token');
      setTimeout(() => setControlMessage(''), 3000);
      console.error('Token generation error:', err);
    }
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
  };

  const openUpdateModal = () => {
    if (device) {
      const deviceTypeObj = deviceTypes.find(type => type.name === device.type);
      setUpdateForm({
        name: device.name,
        type: deviceTypeObj?.id || 1,
        ip_address: device.ip_address,
        mac_address: device.mac_address,
        firmware_version_id: 1, // You may need to map firmware_version to its ID
        address: device.address,
        city: device.city
      });
      setShowUpdateModal(true);
      setUpdateMessage('');
    }
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateMessage('');
  };

  const openFirmwareModal = () => {
    setShowFirmwareModal(true);
  };

  const closeFirmwareModal = () => {
    setShowFirmwareModal(false);
  };

  const generateFirmwareToken = async (): Promise<string> => {
    if (!id) throw new Error('Device ID not found');

    try {
      const response = await devicesAPI.generateDeviceToken(parseInt(id));
      setGeneratedToken(response.token); // Also update the global token
      return response.token;
    } catch (err: any) {
      console.error('Token generation error:', err);
      throw err;
    }
  };

  const buildAndDownloadFirmwareDirect = async (config: any, deviceToken: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Please login to build firmware');
    }

    if (!deviceToken) {
      throw new Error('Please provide or generate a device token first');
    }

    const response = await fetch('/api/codegen/build-and-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...config,
        token: deviceToken
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Build failed');
    }

    // Trigger download
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


  const handleUpdateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setUpdateMessage('Please login to update device');
      return;
    }

    try {
      await devicesAPI.updateDevice(parseInt(id!), updateForm);
      setUpdateMessage('Device updated successfully!');
      setTimeout(() => {
        loadDeviceData();
        closeUpdateModal();
      }, 1500);
    } catch (err) {
      setUpdateMessage('Failed to update device');
      console.error(err);
    }
  };

  const controlDevice = async (action: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setControlMessage('Please login to control devices');
      setTimeout(() => setControlMessage(''), 3000);
      return;
    }

    try {
      const response = await devicesAPI.controlDevice(parseInt(id!), action);
      
      if (response.success) {
        const actionNames: { [key: number]: string } = {
          4: 'turned on',
          5: 'turned off',
          6: 'configured',
        };
        setControlMessage(`Device ${actionNames[action]} successfully!`);
        setTimeout(() => {
          loadDeviceData();
          setControlMessage('');
        }, 2000);
      } else {
        setControlMessage(response.message || 'Control action failed');
      }
    } catch (err) {
      setControlMessage('Failed to control device');
      console.error(err);
    }
  };

  const getStatusType = (stateId: number, isOnline: boolean): 'active' | 'inactive' | 'maintenance' | 'decommissioned' | 'unknown' | 'online' => {
    // If device has recent readings, show as online regardless of device_state
    if (isOnline) {
      return 'online';
    }
    
    const states: { [key: number]: any } = {
      1: 'active',
      2: 'inactive',
      3: 'maintenance',
      4: 'decommissioned',
    };
    return states[stateId] || 'unknown';
  };

  const isDeviceOnline = (): boolean => {
    if (readings.length === 0) return false;
    
    // Get the most recent reading
    const latestReading = readings[0];
    const now = new Date().getTime();
    const readingTime = latestReading.timestamp;
    
    // Consider device online if it has sent a reading within the last 10 minutes
    const tenMinutesInMs = 10 * 60 * 1000;
    return (now - readingTime) <= tenMinutesInMs;
  };

  const getLatestReading = () => {
    return readings.length > 0 ? readings[0] : null;
  };

  // Prepare data for main aggregate chart
  const getAggregateChartData = () => {
    const chartData = readings
      .slice(0, 100) // Limit to 100 most recent readings for better performance
      .reverse() // Show oldest to newest
      .map(reading => ({
        time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voltage: reading.voltage ?? 0,
        current: reading.current ?? 0,
        power: reading.power ?? 0,
        timestamp: reading.timestamp
      }));
    
    return chartData;
  };

  // Prepare data for detailed daily chart
  const getDetailedChartData = () => {
    if (!selectedDay) return [];

    // Recreate the logic to find the selected day's data
    const dailyData: { [key: string]: Reading[] } = {};

    // Use allReadings (last 7 days) for breakdown
    allReadings.forEach(reading => {
      const date = new Date(reading.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(reading);
    });

    const readings = dailyData[selectedDay] || [];
    const chartData = readings
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(r => ({
        time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voltage: r.voltage ?? 0,
        current: r.current ?? 0,
        power: r.power ?? 0
      }));

    return chartData;
  };

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
    <div className="space-y-6">
      {/* Header */}
      <DeviceHeader
        device={device}
        deviceOnline={deviceOnline}
        latestReading={latestReading}
        onGenerateToken={generateToken}
        onBack={() => navigate('/devices')}
        onUpdate={openUpdateModal}
      />

      {/* Control Message */}
      {controlMessage && (
        <div className={`p-4 rounded-lg ${controlMessage.includes('success') || controlMessage.includes('turned') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          {controlMessage}
        </div>
      )}

      {/* Token Modal */}
      <DeviceTokenModal
        isOpen={showTokenModal}
        token={generatedToken}
        onClose={closeTokenModal}
      />

      {/* Update Device Modal */}
      <UpdateDeviceModal
        isOpen={showUpdateModal}
        onClose={closeUpdateModal}
        onSubmit={handleUpdateDevice}
        formData={updateForm}
        onFormChange={setUpdateForm}
        deviceTypes={deviceTypes}
        message={updateMessage}
      />

      {/* Firmware Builder Modal */}
      <FirmwareBuilderModal
        isOpen={showFirmwareModal}
        onClose={closeFirmwareModal}
        device={device}
        onBuildAndDownload={buildAndDownloadFirmwareDirect}
        onGenerateToken={generateFirmwareToken}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Device Info */}
        <DeviceInfoCard
          device={device}
          status={getStatusType(device.device_state, deviceOnline)}
          latestReading={latestReading}
          onUpdate={openUpdateModal}
          onViewHistory={() => navigate(`/devices/${id}/state-history`)}
        />

        {/* Latest Reading */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
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
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{latestReading.temperature.toFixed(1)}°C</span>
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
        </div>

        {/* Control Panel */}
        <DeviceControlPanel
          deviceState={device.device_state}
          canControl={deviceType?.features?.can_control || false}
          onControl={controlDevice}
          onRefresh={() => {
            loadDeviceData();
            loadReadings();
          }}
          onGenerateToken={generateToken}
        />

        {/* Custom Firmware Builder */}
        <Codegen
          onOpenFirmwareModal={openFirmwareModal}
          onOpenOnlineBuilder={() => setIsOnlineBuilderOpen(true)}
          onOpenOTAUpload={() => setIsOTAUploadOpen(true)}
          onOpenFirmwareUpload={() => setIsFirmwareUploadModalOpen(true)}
          generatedToken={generatedToken}
        />
      </div>

      {/* Main Aggregate Chart */}
      {readings.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedDay ? `Detailed View - ${selectedDay}` : 'Aggregate Performance Chart'}
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
                  <stop offset="5%" stopColor="#5E81AC" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#5E81AC" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A3BE8C" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#A3BE8C" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B48EAD" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#B48EAD" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis 
                dataKey="time" 
                stroke="var(--text-tertiary)"
                tick={{ fill: 'var(--text-tertiary)' }}
              />
              <YAxis 
                stroke="var(--text-tertiary)"
                tick={{ fill: 'var(--text-tertiary)' }}
              />
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
              <Area 
                type="monotone" 
                dataKey="voltage" 
                stroke="#5E81AC" 
                fillOpacity={1}
                fill="url(#colorVoltage)" 
                name="Voltage (V)"
              />
              <Area 
                type="monotone" 
                dataKey="current" 
                stroke="#A3BE8C" 
                fillOpacity={1}
                fill="url(#colorCurrent)" 
                name="Current (A)"
              />
              <Area 
                type="monotone" 
                dataKey="power" 
                stroke="#B48EAD" 
                fillOpacity={1}
                fill="url(#colorPower)" 
                name="Power (W)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Daily Breakdown Charts */}
      <DailyBreakdownCharts
        allReadings={allReadings}
        selectedDay={selectedDay}
        onDaySelect={setSelectedDay}
      />

      {/* Firmware Upload Modal */}
      <FirmwareUploadModal
        isOpen={isFirmwareUploadModalOpen}
        onClose={() => setIsFirmwareUploadModalOpen(false)}
        deviceId={device?.id || 0}
        deviceName={device?.name || ''}
        onUploadSuccess={() => {
          // Refresh device data after successful upload
          loadDeviceData();
          setIsFirmwareUploadModalOpen(false);
        }}
      />

      {/* Online Firmware Builder Modal */}
      <OnlineFirmwareBuilder
        isOpen={isOnlineBuilderOpen}
        onClose={() => setIsOnlineBuilderOpen(false)}
        deviceId={device?.id || 0}
        deviceName={device?.name || ''}
        deviceIp={device?.ip_address}
      />

      {/* OTA Firmware Upload Modal */}
      <OTAFirmwareUpload
        isOpen={isOTAUploadOpen}
        onClose={() => setIsOTAUploadOpen(false)}
        deviceId={device?.id || 0}
        deviceName={device?.name || ''}
        deviceIp={device?.ip_address}
      />
     
    </div>
  );
};
