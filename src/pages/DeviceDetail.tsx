import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Power, PowerOff, Settings, RefreshCw, Activity, AlertCircle, TrendingUp } from 'lucide-react';
import { readingsAPI } from '../api/readings';
import { StatusBadge } from '../components/Cards';
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

export const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [controlMessage, setControlMessage] = useState('');
  const [readingsLimit, setReadingsLimit] = useState(20);

  useEffect(() => {
    if (id) {
      loadDeviceData();
      loadReadings();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        loadDeviceData();
        loadReadings();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [id, readingsLimit]);

  const loadDeviceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/devices/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (!response.ok) throw new Error('Failed to load device');
      
      const data = await response.json();
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
      const data = await readingsAPI.getByDevice(id);
      // Sort by timestamp descending (newest first)
      const sortedReadings = data.sort((a, b) => b.timestamp - a.timestamp).slice(0, readingsLimit);
      setReadings(sortedReadings);
    } catch (err) {
      console.error('Failed to load readings:', err);
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

  const getStatusType = (stateId: number): 'active' | 'inactive' | 'maintenance' | 'decommissioned' | 'unknown' => {
    const states: { [key: number]: any } = {
      1: 'active',
      2: 'inactive',
      3: 'maintenance',
      4: 'decommissioned',
    };
    return states[stateId] || 'unknown';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/devices')}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          ← Back to Devices
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{device.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{device.type} • {device.city}</p>
      </div>

      {/* Control Message */}
      {controlMessage && (
        <div className={`p-4 rounded-lg ${controlMessage.includes('success') || controlMessage.includes('turned') ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'}`}>
          {controlMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Device Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">Status</span>
              <div className="mt-1">
                <StatusBadge status={getStatusType(device.device_state)} />
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
        </div>

        {/* Control Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Control Panel</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => controlDevice(4)}
              disabled={device.device_state === 1}
              className="flex flex-col items-center justify-center p-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Power size={24} />
              <span className="mt-2 text-sm font-medium">Turn On</span>
            </button>
            <button
              onClick={() => controlDevice(5)}
              disabled={device.device_state === 2}
              className="flex flex-col items-center justify-center p-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <PowerOff size={24} />
              <span className="mt-2 text-sm font-medium">Turn Off</span>
            </button>
            <button
              onClick={() => controlDevice(6)}
              disabled={device.device_state === 3 || device.device_state === 4}
              className="flex flex-col items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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
        </div>

        {/* Latest Reading */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Latest Reading</h2>
          {latestReading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Voltage</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{(latestReading.voltage ?? 0).toFixed(2)}V</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Current</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">{(latestReading.current ?? 0).toFixed(2)}A</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Power</span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{(latestReading.power ?? 0).toFixed(2)}W</span>
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
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">No readings available</div>
          )}
        </div>
      </div>

      {/* Averages */}
      {readings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Average Voltage</p>
                <p className="text-3xl font-bold mt-1">{averages.voltage.toFixed(2)}V</p>
              </div>
              <Activity size={40} className="text-blue-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Average Current</p>
                <p className="text-3xl font-bold mt-1">{averages.current.toFixed(2)}A</p>
              </div>
              <TrendingUp size={40} className="text-green-200" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Average Power</p>
                <p className="text-3xl font-bold mt-1">{averages.power.toFixed(2)}W</p>
              </div>
              <AlertCircle size={40} className="text-purple-200" />
            </div>
          </div>
        </div>
      )}

      {/* Readings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Readings</h2>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {(reading.voltage ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      {(reading.current ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600 dark:text-purple-400">
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
