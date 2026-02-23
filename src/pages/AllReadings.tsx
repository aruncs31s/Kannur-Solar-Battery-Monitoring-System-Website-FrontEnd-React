import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Download } from 'lucide-react';
import { LoadingState } from '../components/LoadingState';
import { PageHeader } from '../components/PageHeader';

interface DeviceReading {
  id: string;
  deviceId: string;
  deviceName: string;
  voltage: number;
  current: number;
  power: number;
  temperature?: number;
  timestamp: number;
}

export const AllReadings = () => {
  const [readings, setReadings] = useState<DeviceReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllReadings();
  }, []);

  const loadAllReadings = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First, get all devices
      const devicesRes = await fetch('http://localhost:8080/api/devices');
      if (!devicesRes.ok) throw new Error('Failed to load devices');
      
      const devicesData = await devicesRes.json();
      const devices = devicesData.devices || [];
      
      if (devices.length === 0) {
        setReadings([]);
        setLoading(false);
        return;
      }

      // Load readings for all devices
      const allReadings: DeviceReading[] = [];
      
      for (const device of devices) {
        try {
          const readingsRes = await fetch(`http://localhost:8080/api/devices/${device.id}/readings?limit=10`);
          if (readingsRes.ok) {
            const readingsData = await readingsRes.json();
            const deviceReadings = (readingsData.readings || []).map((reading: any) => ({
              id: reading.id?.toString() || `${device.id}-${reading.timestamp}`,
              deviceId: device.id.toString(),
              deviceName: device.name,
              voltage: reading.voltage || 0,
              current: reading.current || 0,
              power: reading.power || reading.voltage * reading.current || 0,
              temperature: reading.temperature,
              timestamp: reading.timestamp ? new Date(reading.timestamp).getTime() : Date.now(),
            }));
            allReadings.push(...deviceReadings);
          }
        } catch (err) {
          console.error(`Failed to load readings for device ${device.id}:`, err);
        }
      }

      // Sort by timestamp descending (newest first)
      allReadings.sort((a, b) => b.timestamp - a.timestamp);
      setReadings(allReadings);
    } catch (err) {
      setError('Failed to load readings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (readings.length === 0) return;

    const headers = ['Device', 'Timestamp', 'Voltage (V)', 'Current (A)', 'Power (W)', 'Temperature (°C)'];
    const rows = readings.map(r => [
      r.deviceName,
      new Date(r.timestamp).toLocaleString(),
      r.voltage.toFixed(2),
      r.current.toFixed(2),
      r.power.toFixed(2),
      r.temperature?.toFixed(1) || 'N/A',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-readings-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingState message="Loading readings..." minHeight="h-64" />;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="All Readings"
        description="View readings from all devices"
      >
        <button
          onClick={loadAllReadings}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
        <button
          onClick={exportToCSV}
          disabled={readings.length === 0}
          className="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Download size={18} />
          Export CSV
        </button>
      </PageHeader>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Device
                </th>
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
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No readings found
                  </td>
                </tr>
              ) : (
                readings.map((reading) => (
                  <tr key={reading.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/devices/${reading.deviceId}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {reading.deviceName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(reading.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                      {reading.voltage.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                      {reading.current.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-600 dark:text-purple-400">
                      {reading.power.toFixed(2)}
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

      {/* Summary Stats */}
      {readings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4">
            <p className="text-blue-600 dark:text-blue-300 text-sm font-medium">Total Readings</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">{readings.length}</p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4">
            <p className="text-green-600 dark:text-green-300 text-sm font-medium">Avg Voltage</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
              {(readings.reduce((sum, r) => sum + r.voltage, 0) / readings.length).toFixed(2)}V
            </p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4">
            <p className="text-purple-600 dark:text-purple-300 text-sm font-medium">Avg Current</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
              {(readings.reduce((sum, r) => sum + r.current, 0) / readings.length).toFixed(2)}A
            </p>
          </div>
          <div className="bg-orange-100 dark:bg-orange-900 rounded-lg p-4">
            <p className="text-orange-600 dark:text-orange-300 text-sm font-medium">Avg Power</p>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100 mt-1">
              {(readings.reduce((sum, r) => sum + r.power, 0) / readings.length).toFixed(2)}W
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
