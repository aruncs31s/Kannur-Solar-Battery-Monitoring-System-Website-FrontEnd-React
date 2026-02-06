import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Power, PowerOff, Settings, RefreshCw, Activity, AlertCircle, TrendingUp, Calendar, History, Copy, Check, X, Edit, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { readingsAPI } from '../api/readings';
import { devicesAPI } from '../api/devices';
import { StatusBadge } from '../components/Cards';
import { FormField, FormError } from '../components/FormComponents';
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

interface DeviceType {
  id: number;
  name: string;
  hardware_type?: number;
  features?: {
    can_control?: boolean;
  };
}

interface ConnectedDevice {
  id: number;
  name: string;
  type: string;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  address: string;
  city: string;
  device_state: number;
  hardware_type?: number;
}

export const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return ;
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
    type: 0,
    ip_address: '',
    mac_address: '',
    firmware_version_id: 0,
    address: '',
    city: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [showAddConnectedModal, setShowAddConnectedModal] = useState(false);
  const [newConnectedDeviceId, setNewConnectedDeviceId] = useState('');
  const [addConnectedMode, setAddConnectedMode] = useState<'existing' | 'new'>('new');
  const [newConnectedDeviceForm, setNewConnectedDeviceForm] = useState({
    name: '',
    type: 1,
    ip_address: '',
    mac_address: ''
  });
  
  // Connected device readings modal state
  const [selectedConnectedDevice, setSelectedConnectedDevice] = useState<ConnectedDevice | null>(null);
  const [showConnectedReadingsModal, setShowConnectedReadingsModal] = useState(false);
  const [connectedDeviceReadings, setConnectedDeviceReadings] = useState<Reading[]>([]);
  const [loadingConnectedReadings, setLoadingConnectedReadings] = useState(false);
  
  // State for automatic connected device readings display
  const [singleConnectedReading, setSingleConnectedReading] = useState<Reading | null>(null);
  const [multipleConnectedReadings, setMultipleConnectedReadings] = useState<{ [deviceId: number]: Reading | null }>({});
  const [expandedDevices, setExpandedDevices] = useState<{ [deviceId: number]: boolean }>({});
  const [loadingSingleReading, setLoadingSingleReading] = useState(false);
  const [loadingMultipleReadings, setLoadingMultipleReadings] = useState(false);
  
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
      loadConnectedDevices();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadDeviceData();
        loadReadings();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [id, readingsLimit, startDate, endDate, useDateFilter]);

  useEffect(() => {
    // Load automatic connected device readings when connected devices change
    if (connectedDevices.length > 0) {
      loadAutomaticConnectedReadings();
    }
  }, [connectedDevices]);

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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/devices/${id}/type`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log(response)
      if (!response.ok) throw new Error('Failed to load device type');
      
      const data = await response.json();
      setDeviceType({
        id: 0, // We don't have an ID from this API
        name: data.name,
        hardware_type: data.hardware_type
      });
    } catch (err) {
      console.error('Failed to load device type:', err);
    }
  };

  const loadConnectedDevices = async () => {
    if (!id) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/devices/${id}/connected`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!response.ok) throw new Error('Failed to load connected devices');
      
      const data = await response.json();
      setConnectedDevices(data.connected_devices || []);
    } catch (err) {
      console.error('Failed to load connected devices:', err);
    }
  };

  const addConnectedDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setControlMessage('Please login to add connected devices');
      setTimeout(() => setControlMessage(''), 3000);
      return;
    }

    try {
      let response;
      
      if (addConnectedMode === 'existing') {
        if (!newConnectedDeviceId) {
          setControlMessage('Please enter a device ID');
          setTimeout(() => setControlMessage(''), 3000);
          return;
        }
        
        response = await fetch(`http://localhost:8080/api/devices/${id}/connected`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ child_id: parseInt(newConnectedDeviceId) }),
        });
      } else {
        if (!newConnectedDeviceForm.name || !newConnectedDeviceForm.type) {
          setControlMessage('Please fill in required fields');
          setTimeout(() => setControlMessage(''), 3000);
          return;
        }
        
        response = await fetch(`http://localhost:8080/api/devices/${id}/connected/new`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newConnectedDeviceForm),
        });
      }

      const data = await response.json();
      
      if (response.ok) {
        setControlMessage(
          addConnectedMode === 'existing' 
            ? 'Connected device added successfully!' 
            : 'New device created and connected successfully!'
        );
        setNewConnectedDeviceId('');
        setNewConnectedDeviceForm({
          name: '',
          type: 1,
          ip_address: '',
          mac_address: ''
        });
        setShowAddConnectedModal(false);
        loadConnectedDevices();
        setTimeout(() => setControlMessage(''), 3000);
      } else {
        setControlMessage(data.error || 'Failed to add connected device');
        setTimeout(() => setControlMessage(''), 3000);
      }
    } catch (err) {
      setControlMessage('Failed to add connected device');
      setTimeout(() => setControlMessage(''), 3000);
      console.error(err);
    }
  };

  const handleConnectedDeviceClick = async (device: ConnectedDevice) => {
    setSelectedConnectedDevice(device);
    setShowConnectedReadingsModal(true);
    setLoadingConnectedReadings(true);
    
    try {
      const data = await readingsAPI.getByDevice(device.id.toString());
      const sortedReadings = data.sort((a, b) => b.timestamp - a.timestamp);
      setConnectedDeviceReadings(sortedReadings.slice(0, 5)); // Get latest 5 readings
    } catch (err) {
      console.error('Failed to load connected device readings:', err);
      setConnectedDeviceReadings([]);
    } finally {
      setLoadingConnectedReadings(false);
    }
  };

  const closeConnectedReadingsModal = () => {
    setShowConnectedReadingsModal(false);
    setSelectedConnectedDevice(null);
    setConnectedDeviceReadings([]);
  };

  const loadAutomaticConnectedReadings = async () => {
    // Filter connected devices by hardware_type === 1
    const supportedDevices = connectedDevices.filter(d => d.hardware_type === 1);
    
    if (supportedDevices.length === 0) {
      setSingleConnectedReading(null);
      setMultipleConnectedReadings({});
      return;
    }
    
    if (supportedDevices.length === 1) {
      // Single device: fetch its latest reading
      setLoadingSingleReading(true);
      try {
        const readings = await readingsAPI.getByDevice(supportedDevices[0].id, 1);
        setSingleConnectedReading(readings.length > 0 ? readings[0] : null);
      } catch (err) {
        console.error('Failed to load single connected device reading:', err);
        setSingleConnectedReading(null);
      } finally {
        setLoadingSingleReading(false);
      }
    } else {
      // Multiple devices: fetch latest reading for each
      setLoadingMultipleReadings(true);
      try {
        const readingsMap: { [deviceId: number]: Reading | null } = {};
        await Promise.all(
          supportedDevices.map(async (device) => {
            try {
              const readings = await readingsAPI.getByDevice(device.id, 1);
              readingsMap[device.id] = readings.length > 0 ? readings[0] : null;
            } catch (err) {
              console.error(`Failed to load readings for device ${device.id}:`, err);
              readingsMap[device.id] = null;
            }
          })
        );
        setMultipleConnectedReadings(readingsMap);
        // Auto-expand all devices by default
        const expanded: { [deviceId: number]: boolean } = {};
        supportedDevices.forEach(d => expanded[d.id] = true);
        setExpandedDevices(expanded);
      } catch (err) {
        console.error('Failed to load multiple connected device readings:', err);
        setMultipleConnectedReadings({});
      } finally {
        setLoadingMultipleReadings(false);
      }
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
      const response = await fetch(`http://localhost:8080/api/devices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateForm),
      });

      const data = await response.json();
      
      if (response.ok) {
        setUpdateMessage('Device updated successfully!');
        setTimeout(() => {
          loadDeviceData();
          closeUpdateModal();
        }, 1500);
      } else {
        setUpdateMessage(data.error || 'Failed to update device');
      }
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
      const response = await fetch(`http://localhost:8080/api/devices/${id}/control`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      
      if (response.ok) {
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
        setControlMessage(data.error || 'Control action failed');
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

  const isMicrocontroller = (device: DeviceInfo): boolean => {
    // Check if device type indicates it's a microcontroller
    const type = device.type.toLowerCase();
    return type.includes('esp') || 
           type.includes('microcontroller') || 
           type.includes('arduino') || 
           type.includes('raspberry') ||
           type.includes('controller') ||
           deviceType?.hardware_type === 1;
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
      <div>
        <button
          onClick={() => navigate('/devices')}
          className="text-nord-8 hover:text-nord-9 hover:underline mb-4"
        >
          ← Back to Devices
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{device.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{device.type} • {device.city}</p>
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

      {/* Add Connected Device Modal */}
      {showAddConnectedModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary flex justify-between items-center">
              <h3 className="text-2xl font-bold text-text-primary">Add Connected Device</h3>
              <button
                onClick={() => setShowAddConnectedModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Mode Toggle */}
            <div className="p-6 pb-0">
              <div className="flex gap-2 bg-surface-secondary rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setAddConnectedMode('new')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    addConnectedMode === 'new'
                      ? 'bg-primary-500 text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Create New Device
                </button>
                <button
                  type="button"
                  onClick={() => setAddConnectedMode('existing')}
                  className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                    addConnectedMode === 'existing'
                      ? 'bg-primary-500 text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Add Existing Device
                </button>
              </div>
            </div>
            
            <form onSubmit={addConnectedDevice} className="p-6 space-y-4">
              {addConnectedMode === 'existing' ? (
                <div>
                  <label className="block text-sm font-semibold text-text-secondary mb-2">
                    Device ID *
                  </label>
                  <input
                    type="number"
                    value={newConnectedDeviceId}
                    onChange={(e) => setNewConnectedDeviceId(e.target.value)}
                    required
                    placeholder="Enter device ID to connect"
                    className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    Enter the ID of an existing device you want to connect
                  </p>
                </div>
              ) : (
                <>
                  <FormField
                    label="Device Name"
                    name="name"
                    value={newConnectedDeviceForm.name}
                    onChange={(e) => setNewConnectedDeviceForm({ ...newConnectedDeviceForm, name: e.target.value })}
                    placeholder="ESP32 Board"
                    required
                  />

                  <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">
                      Device Type *
                    </label>
                    <select
                      value={newConnectedDeviceForm.type}
                      onChange={(e) => setNewConnectedDeviceForm({ ...newConnectedDeviceForm, type: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select device type</option>
                      {deviceTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FormField
                    label="IP Address"
                    name="ip_address"
                    value={newConnectedDeviceForm.ip_address}
                    onChange={(e) => setNewConnectedDeviceForm({ ...newConnectedDeviceForm, ip_address: e.target.value })}
                    placeholder="192.168.1.100"
                  />

                  <FormField
                    label="MAC Address"
                    name="mac_address"
                    value={newConnectedDeviceForm.mac_address}
                    onChange={(e) => setNewConnectedDeviceForm({ ...newConnectedDeviceForm, mac_address: e.target.value })}
                    placeholder="AA:BB:CC:DD:EE:FF"
                  />
                </>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddConnectedModal(false)}
                  className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  {addConnectedMode === 'existing' ? 'Connect Device' : 'Create & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <>
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
                  
                </>
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

        {/* Device Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Device Information</h2>
            <div className="flex gap-2">
              {/* <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 text-nord-8 hover:text-nord-9 hover:bg-nord-6 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Create New Device"
              >
                <Plus size={20} />
              </button> */}
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
              <div className="flex items-center gap-2">
                <p className="text-gray-900 dark:text-white font-medium">{device.type}</p>
                {isMicrocontroller(device) && (
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 text-xs font-medium rounded-full border border-orange-200 dark:border-orange-800">
                    Microcontroller
                  </span>
                )}
              </div>
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

        {/* Control Panel or Connected Devices */}
        {(deviceType?.features?.can_control || deviceType?.hardware_type === 1) ? (
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">{connectedDevice.type} • {connectedDevice.ip_address}</p>
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
              // Single connected device - show its readings
              const connectedDevice = supportedDevices[0];
              return (
                <>
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Latest Reading</h2>
                    <p className="text-xs text-primary-500 mt-1">From connected device: {connectedDevice.name}</p>
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
                          <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{singleConnectedReading.temperature.toFixed(1)}°C</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {new Date(singleConnectedReading.timestamp).toLocaleString()}
                      </div>
                      <button
                        onClick={() => navigate(`/devices/${connectedDevice.id}/history`)}
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
              // Multiple connected devices - show expandable sections
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
                      {supportedDevices.map((device) => {
                        const reading = multipleConnectedReadings[device.id];
                        const isExpanded = expandedDevices[device.id];
                        
                        return (
                          <div key={device.id} className="border border-border-primary rounded-lg overflow-hidden">
                            <button
                              onClick={() => setExpandedDevices(prev => ({ ...prev, [device.id]: !prev[device.id] }))}
                              className="w-full px-4 py-3 bg-surface-secondary hover:bg-surface-tertiary flex items-center justify-between transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                                  <Activity size={18} className="text-primary-500" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold text-text-primary">{device.name}</h3>
                                  <p className="text-xs text-text-tertiary">{device.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {reading && (
                                  <div className="text-right mr-2">
                                    <span className="text-xs font-semibold text-nord-8">{(reading.voltage ?? 0).toFixed(1)}V</span>
                                    <span className="text-xs text-text-tertiary mx-1">•</span>
                                    <span className="text-xs font-semibold text-success">{(reading.current ?? 0).toFixed(2)}A</span>
                                    <span className="text-xs text-text-tertiary mx-1">•</span>
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
                                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{reading.temperature.toFixed(1)}°C</p>
                                      </div>
                                    )}
                                    <div className="text-xs text-text-tertiary">
                                      Last updated: {new Date(reading.timestamp).toLocaleString()}
                                    </div>
                                    <button
                                      onClick={() => navigate(`/devices/${device.id}/history`)}
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
              // No supported connected devices - show parent device readings
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
