import { useEffect, useState } from 'react';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { StatsCard, StatusBadge } from '../components/Cards';
import { Activity, AlertCircle } from 'lucide-react';

export const Dashboard = () => {
  const { devices, setDevices, setLoading, setError } = useDevicesStore();
  const [readings, setReadings] = useState<any[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      try {
        const response = await devicesAPI.getAllDevices();
        setDevices(response);
        if (response.length > 0) {
          setSelectedDeviceId(response[0].id);
        }
      } catch (err) {
        setError('Failed to fetch devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    const fetchReadings = async () => {
      if (!selectedDeviceId) return;
      try {
        // Voltage readings are not yet implemented in the backend
        // This will be enabled once the backend supports voltage data
        setReadings([]);
      } catch (err) {
        setError('Failed to fetch readings');
      }
    };

    fetchReadings();
    // Remove the interval since readings are not available
    // const interval = setInterval(fetchReadings, 10000);
    // return () => clearInterval(interval);
  }, [selectedDeviceId]);

  const activeDevices = devices.filter((d) => d.status === 'active').length;
  const inactiveDevices = devices.filter((d) => d.status === 'inactive').length;
  const avgVoltage =
    readings.length > 0
      ? (readings.reduce((sum, r) => sum + r.voltage, 0) / readings.length).toFixed(2)
      : '0.00';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Real-time monitoring of your solar battery system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Devices"
          value={devices.length}
          icon="📦"
          color="blue"
        />
        <StatsCard
          title="Active Devices"
          value={activeDevices}
          icon="✅"
          color="green"
        />
        <StatsCard
          title="Inactive Devices"
          value={inactiveDevices}
          icon="⚠️"
          color="yellow"
        />
        <StatsCard
          title="Avg Voltage"
          value={`${avgVoltage}V`}
          icon="⚡"
          color="blue"
        />
      </div>

      {/* Device Selection and Readings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Voltage Readings
        </h2>

        {devices.length > 0 ? (
          <div className="space-y-6">
            {/* Device Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Device
              </label>
              <select
                value={selectedDeviceId || ''}
                onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name} - {device.installedLocation}
                  </option>
                ))}
              </select>
            </div>

            {/* Chart */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
              <Activity className="mx-auto text-yellow-600 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Voltage Readings Coming Soon</h3>
              <p className="text-yellow-700">
                Real-time voltage monitoring is not yet implemented in the backend.
                This feature will be available once voltage data collection is added to the system.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">No devices found. Visit Admin to add devices.</p>
          </div>
        )}
      </div>

      {/* Device List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => (
            <div
              key={device.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{device.name}</h3>
                  <p className="text-sm text-gray-600">{device.mac}</p>
                </div>
                <StatusBadge status={device.status} />
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📍 {device.installedLocation || 'Not specified'}</p>
                <p>👤 {device.installedBy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
