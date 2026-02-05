import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Power, PowerOff, Settings, RefreshCw, Activity, AlertCircle, TrendingUp, Calendar, History, Copy, Check, X, Edit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { readingsAPI } from '../api/readings';
import { devicesAPI } from '../api/devices';
import { StatusBadge } from '../components/Cards';
import { Reading } from '../domain/entities/Reading';

const formatMetric = (value: number | null | undefined, unit: string) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${value.toFixed(2)} ${unit}`;
};

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return 'No data';
  return new Date(timestamp).toLocaleString();
};
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

interface DeviceType {
  id: number;
  name: string;
  features?: {
    can_control?: boolean;
  };
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
  const [tokenCopied, setTokenCopied] = useState(false);
  const [readingsLimit, setReadingsLimit] = useState(20);
  
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
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  
  
  // Date picker state - default to today
  const getDefaultDates = () => {
    const today = new Date();
    return {
      start: today.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [useDateFilter, setUseDateFilter] = useState(false); // Default to disabled to show all readings
  const [allReadings, setAllReadings] = useState<Reading[]>([]); // Store all readings for breakdown
  const [selectedDay, setSelectedDay] = useState<string | null>(null); // For zooming into daily view
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'voltage' | 'current' | 'power'>('all'); // For filtering chart by metric




  useEffect(() => {
    if (id) {
      loadDeviceData();
      loadReadings();
      loadDeviceTypes();
      loadDeviceType();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadDeviceData();
        loadReadings();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [id, readingsLimit, startDate, endDate, useDateFilter]);

  const loadDeviceTypes = async () => {
    try {
      const data = await devicesAPI.getDeviceTypes();
      setDeviceTypes(data);
    } catch (err) {
      console.error('Failed to load device types:', err);
    }
  };

  const loadDeviceType = async () => {
    if (!id) return;
    try {
      const data = await devicesAPI.getDeviceType(parseInt(id));
      setDeviceType(data);
    } catch (err) {
      console.error('Failed to load device type:', err);
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
      setTokenCopied(false);
    } catch (err: any) {
      setControlMessage('Failed to generate token');
      setTimeout(() => setControlMessage(''), 3000);
      console.error('Token generation error:', err);
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(generatedToken);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setGeneratedToken('');
    setTokenCopied(false);
  };

  const openUpdateModal = () => {
    if (device) {
      setUpdateForm({
        name: device.name,
        type: 1, // You may need to map device.type to its ID
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

  // Create device handlers
  // const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setCreateFormData((prev) => ({
  //     ...prev,
  //     [name]: name === 'type' ? parseInt(value, 10) : value,
  //   }));
  // };

  // const handleCreateDevice = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setCreateError('');

  //   if (!createFormData.name || !createFormData.uid) {
  //     setCreateError('Please fill in the device name and UID');
  //     return;
  //   }

  //   setCreateLoading(true);
  //   try {
  //     const newDevice = await devicesAPI.createDevice(createFormData);
  //     setShowCreateModal(false);
  //     setCreateFormData({
  //       name: '',
  //       uid: '',
  //       type: 1,
  //       ip_address: '',
  //       mac_address: '',
  //       firmware_version_id: 1,
  //       address: '',
  //       city: '',
  //     });
  //     // Navigate to the new device detail page
  //     navigate(`/devices/${newDevice.id}`);
  //   } catch (err: any) {
  //     setCreateError(err.response?.data?.error || 'Failed to create device');
  //   } finally {
  //     setCreateLoading(false);
  //   }
  // };

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

  const getAverages = () => {
    if (readings.length === 0) return { voltage: 0, current: 0, power: 0 };
    
    const sum = readings.reduce(
      (acc, r) => ({
        voltage: acc.voltage + (r.voltage ?? 0),
        current: acc.current + (r.current ?? 0),
        power: acc.power + (r.power ?? 0),
      }),
      { voltage: 0, current: 0, power: 0 }
    );
    
    return {
      voltage: sum.voltage / readings.length,
      current: sum.current / readings.length,
      power: sum.power / readings.length,
    };
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
    
    // Add average lines if a specific metric is selected
    if (selectedMetric !== 'all') {
      const avgValue = selectedMetric === 'voltage' ? averages.voltage : 
                      selectedMetric === 'current' ? averages.current : averages.power;
      chartData.forEach((dataPoint: any) => {
        dataPoint[`${selectedMetric}Avg`] = avgValue;
      });
    }
    
    return chartData;
  };

  // Prepare data for detailed daily chart
  const getDetailedChartData = () => {
    if (!selectedDay) return [];
    
    const dayData = getDailyBreakdown().find(day => day.date === selectedDay);
    if (!dayData) return [];
    
    const chartData = dayData.chartData;
    
    // Add average lines if a specific metric is selected
    if (selectedMetric !== 'all') {
      const avgValue = selectedMetric === 'voltage' ? dayData.avgVoltage : 
                      selectedMetric === 'current' ? dayData.avgCurrent : dayData.avgPower;
      chartData.forEach((dataPoint: any) => {
        dataPoint[`${selectedMetric}Avg`] = avgValue;
      });
    }
    
    return chartData;
  };

  // Group readings by day for breakdown charts
  const getDailyBreakdown = () => {
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
    
    // Generate all 7 days, even if no data
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
      
      const readings = dailyData[dateString] || [];
      result.push({
        date: dateString,
        readings: readings.sort((a, b) => a.timestamp - b.timestamp),
        chartData: readings
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(r => ({
            time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            voltage: r.voltage ?? 0,
            current: r.current ?? 0,
            power: r.power ?? 0
          })),
        avgVoltage: readings.length > 0 ? readings.reduce((sum, r) => sum + (r.voltage ?? 0), 0) / readings.length : 0,
        avgCurrent: readings.length > 0 ? readings.reduce((sum, r) => sum + (r.current ?? 0), 0) / readings.length : 0,
        avgPower: readings.length > 0 ? readings.reduce((sum, r) => sum + (r.power ?? 0), 0) / readings.length : 0,
        count: readings.length
      });
    }
    
    return result;
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
  const averages = getAverages();
  const deviceOnline = isDeviceOnline();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border-primary bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-emerald-500/10 p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500/15 text-primary-600 dark:text-primary-300">
              <Settings size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Microcontroller</p>
              <h1 className="text-3xl font-bold text-text-primary">{device.name}</h1>
              <p className="text-sm text-text-secondary">{device.type} • {device.city}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold ${deviceOnline ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${deviceOnline ? 'bg-success' : 'bg-error'}`} />
              {deviceOnline ? 'Online' : 'Offline'}
            </span>
            <span className="rounded-full bg-surface-secondary px-4 py-1 text-sm font-semibold text-text-secondary">
              Last updated: {formatTimestamp(latestReading?.timestamp)}
            </span>
            <button
              onClick={() => navigate('/devices')}
              className="rounded-full border border-border-primary px-4 py-1 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
            >
              ← Back to Devices
            </button>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-border-primary bg-surface-primary/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Latest Voltage</p>
            <p className="mt-2 text-2xl font-bold text-text-primary">{formatMetric(latestReading?.voltage ?? null, 'V')}</p>
          </div>
          <div className="rounded-xl border border-border-primary bg-surface-primary/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Latest Current</p>
            <p className="mt-2 text-2xl font-bold text-text-primary">{formatMetric(latestReading?.current ?? null, 'A')}</p>
          </div>
          <div className="rounded-xl border border-border-primary bg-surface-primary/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Latest Power</p>
            <p className="mt-2 text-2xl font-bold text-text-primary">{formatMetric(latestReading?.power ?? null, 'W')}</p>
          </div>
          <div className="rounded-xl border border-border-primary bg-surface-primary/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Readings Count</p>
            <p className="mt-2 text-2xl font-bold text-text-primary">{readings.length}</p>
          </div>
        </div>
      </div>

      {/* Control Message */}
      {controlMessage && (
        <div className={`p-4 rounded-lg ${controlMessage.includes('success') || controlMessage.includes('turned') ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          {controlMessage}
        </div>
      )}

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary flex justify-between items-center">
              <h3 className="text-2xl font-bold text-text-primary">Device Authentication Token</h3>
              <button
                onClick={closeTokenModal}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-blue-900 dark:text-blue-100">
                    <p className="font-semibold mb-1">Important Security Information</p>
                    <p>This token grants access to device data and control. Keep it secure and do not share it publicly.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">JWT Token</label>
                <div className="relative">
                  <div className="bg-surface-secondary border border-border-primary rounded-lg p-4 font-mono text-sm break-all text-text-primary max-h-48 overflow-y-auto">
                    {generatedToken}
                  </div>
                  <button
                    onClick={copyToken}
                    className={`absolute top-2 right-2 px-3 py-1.5 rounded-md font-medium text-sm transition-all ${
                      tokenCopied
                        ? 'bg-success text-white'
                        : 'bg-primary-500 hover:bg-primary-600 text-white'
                    }`}
                  >
                    {tokenCopied ? (
                      <span className="flex items-center gap-1">
                        <Check size={16} />
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy size={16} />
                        Copy
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-text-primary">How to use this token:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
                  <li>Copy the token using the button above</li>
                  <li>Use it in your API requests as a Bearer token</li>
                  <li>Include it in the Authorization header: <code className="bg-surface-secondary px-2 py-1 rounded text-xs">Bearer YOUR_TOKEN</code></li>
                  <li>The token contains your user ID and device ID for authentication</li>
                </ol>
              </div>
            </div>
            
            <div className="p-6 border-t border-border-primary flex justify-end gap-3">
              <button
                onClick={closeTokenModal}
                className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Device Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary flex justify-between items-center">
              <h3 className="text-2xl font-bold text-text-primary">Update Device</h3>
              <button
                onClick={closeUpdateModal}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateDevice} className="p-6 space-y-4">
              {updateMessage && (
                <div className={`p-4 rounded-lg ${
                  updateMessage.includes('success') 
                    ? 'bg-success/10 text-success' 
                    : 'bg-error/10 text-error'
                }`}>
                  {updateMessage}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Device Name *
                </label>
                <input
                  type="text"
                  value={updateForm.name}
                  onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter device name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Device Type
                </label>
                <select
                  value={updateForm.type}
                  onChange={(e) => setUpdateForm({ ...updateForm, type: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select device type</option>
                  {deviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  IP Address
                </label>
                <input
                  type="text"
                  value={updateForm.ip_address}
                  onChange={(e) => setUpdateForm({ ...updateForm, ip_address: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="192.168.1.100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  MAC Address
                </label>
                <input
                  type="text"
                  value={updateForm.mac_address}
                  onChange={(e) => setUpdateForm({ ...updateForm, mac_address: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="AA:BB:CC:DD:EE:FF"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Firmware Version ID
                </label>
                <input
                  type="number"
                  value={updateForm.firmware_version_id}
                  onChange={(e) => setUpdateForm({ ...updateForm, firmware_version_id: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter firmware version ID"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={updateForm.address}
                  onChange={(e) => setUpdateForm({ ...updateForm, address: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="123 Street Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={updateForm.city}
                  onChange={(e) => setUpdateForm({ ...updateForm, city: e.target.value })}
                  className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeUpdateModal}
                  className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  Update Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Device Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Device Information</h2>
            <div className="flex gap-2">
             
              <button
                onClick={openUpdateModal}
                className="p-2 text-nord-8 hover:text-nord-9 hover:bg-nord-6 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Update Device"
              >
                <Edit size={20} />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Status</span>
              <div className="mt-1 space-y-1">
                <StatusBadge status={getStatusType(device.device_state, deviceOnline)} />
                {latestReading && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last reading: {new Date(latestReading.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Type</span>
              <p className="text-gray-900 dark:text-white font-medium">{device.type}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">IP Address</span>
              <p className="text-gray-900 dark:text-white font-medium">{device.ip_address}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">MAC Address</span>
              <p className="text-gray-900 dark:text-white font-medium">{device.mac_address}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Firmware</span>
              <p className="text-gray-900 dark:text-white font-medium">{device.firmware_version}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Location</span>
              <p className="text-gray-900 dark:text-white font-medium">{device.address}, {device.city}</p>
            </div>
          </div>
          <button
            onClick={() => navigate(`/devices/${id}/state-history`)}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-nord-8 hover:bg-nord-9 text-white rounded-lg transition-colors"
          >
            <History size={16} />
            View State History
          </button>
        </div>

        {/* Control Panel */}
        {deviceType?.features?.can_control && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Control Panel</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => controlDevice(4)}
                disabled={device.device_state === 1}
                className="flex flex-col items-center justify-center p-4 bg-success hover:bg-success/80 disabled:bg-nord-3 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Power size={24} />
                <span className="mt-2 text-sm font-medium">Turn On</span>
              </button>
              <button
                onClick={() => controlDevice(5)}
                disabled={device.device_state === 2}
                className="flex flex-col items-center justify-center p-4 bg-error hover:bg-error/80 disabled:bg-nord-3 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <PowerOff size={24} />
                <span className="mt-2 text-sm font-medium">Turn Off</span>
              </button>
              <button
                onClick={() => controlDevice(6)}
                disabled={device.device_state === 3 || device.device_state === 4}
                className="flex flex-col items-center justify-center p-4 bg-nord-8 hover:bg-nord-9 disabled:bg-nord-3 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
              >
                <Settings size={24} />
                <span className="mt-2 text-sm font-medium">Configure</span>
              </button>
              <button
                onClick={() => {
                  loadDeviceData();
                  loadReadings();
                }}
                className="flex flex-col items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={24} />
                <span className="mt-2 text-sm font-medium">Refresh</span>
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={generateToken}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Activity size={20} />
                Generate Device Token
              </button>
            </div>
          </div>
        )}

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
      </div>

      {/* Averages */}
      {readings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className={`bg-gradient-to-br from-nord-9 to-nord-8 text-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 ${
              selectedMetric === 'voltage' ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-105'
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
            className={`bg-gradient-to-br from-success to-nord-14 text-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 ${
              selectedMetric === 'current' ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-105'
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
            className={`bg-gradient-to-br from-nord-15 to-nord-9 text-white rounded-lg shadow p-6 cursor-pointer transition-all duration-200 ${
              selectedMetric === 'power' ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-105'
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
              {(selectedMetric === 'all' || selectedMetric === 'voltage') && (
                <Area 
                  type="monotone" 
                  dataKey="voltage" 
                  stroke="#5E81AC" 
                  fillOpacity={1}
                  fill="url(#colorVoltage)" 
                  name="Voltage (V)"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'current') && (
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#A3BE8C" 
                  fillOpacity={1}
                  fill="url(#colorCurrent)" 
                  name="Current (A)"
                />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'power') && (
                <Area 
                  type="monotone" 
                  dataKey="power" 
                  stroke="#B48EAD" 
                  fillOpacity={1}
                  fill="url(#colorPower)" 
                  name="Power (W)"
                />
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Breakdown (Last 7 Days)</h2>
          <p className="text-gray-600 dark:text-gray-400">Click on any day to zoom into detailed view</p>
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
                    <XAxis 
                      dataKey="time" 
                      stroke="var(--text-tertiary)"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                    />
                    <YAxis 
                      stroke="var(--text-tertiary)"
                      tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                    />
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
                    <Line 
                      type="monotone" 
                      dataKey="voltage" 
                      stroke="#5E81AC" 
                      strokeWidth={2}
                      dot={false}
                      name="V"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      stroke="#A3BE8C" 
                      strokeWidth={2}
                      dot={false}
                      name="A"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="power" 
                      stroke="#B48EAD" 
                      strokeWidth={2}
                      dot={false}
                      name="W"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary-500" size={20} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">Date Range:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useDateFilter"
              checked={useDateFilter}
              onChange={(e) => setUseDateFilter(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="useDateFilter" className="text-sm text-gray-700 dark:text-gray-300">
              Enable Date Filter
            </label>
          </div>
          
          {useDateFilter && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              
              <button
                onClick={() => {
                  const dates = getDefaultDates();
                  setStartDate(dates.start);
                  setEndDate(dates.end);
                }}
                className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Last 7 Days
              </button>
              
              <button
                onClick={() => {
                  const endDate = new Date();
                  const startDate = new Date();
                  startDate.setDate(startDate.getDate() - 30);
                  setStartDate(startDate.toISOString().split('T')[0]);
                  setEndDate(endDate.toISOString().split('T')[0]);
                }}
                className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Last 30 Days
              </button>
            </>
          )}
        </div>
      </div>

      {/* Readings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {useDateFilter ? `Readings (${startDate} to ${endDate})` : 'Recent Readings'}
          </h2>
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Show:
              <select
                value={readingsLimit}
                onChange={(e) => setReadingsLimit(Number(e.target.value))}
                className="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
              </select>
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Voltage (V)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Current (A)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Power (W)
                </th>
                {readings.some(r => r.temperature) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Temperature (°C)
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {readings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No readings available
                  </td>
                </tr>
              ) : (
                readings.map((reading) => (
                  <tr key={reading.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(reading.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-nord-8">
                      {(reading.voltage ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                      {(reading.current ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-nord-15">
                      {(reading.power ?? 0).toFixed(2)}
                    </td>
                    {reading.temperature && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600 dark:text-orange-400">
                        {reading.temperature.toFixed(1)}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

     
    </div>
  );
};
