import { useEffect, useState } from 'react';
import { Plus} from 'lucide-react';
import { devicesAPI } from '../api/devices';
import { DeviceResponseDTO, SolarDeviceView } from '../domain/entities/Device';
import { useSearchStore } from '../store/searchStore';
import { AddSolarDeviceModal } from '../components/AddSolarDeviceModal';
import { SolarDevicesSection } from '../components/SolarDevicesSection';
import { StatsCard } from '../components/Cards';
import { FormError, FormSuccess } from '../components/FormComponents';
import { QuickActions } from '../components/QuickActions';
import { AdvancedDeviceAddModal } from '../components/AdvancedDeviceAddModal';
import { PageHeader } from '../components/PageHeader';
import {
  CheckCircle,
  Battery,
  Zap,
  Package,
} from 'lucide-react';

export const MyDevices = () => {
  const [devices, setDevices] = useState<DeviceResponseDTO[]>([]);
  const [solarDevices, setSolarDevices] = useState<SolarDeviceView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSolarModal, setShowSolarModal] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const { query: searchQuery } = useSearchStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [success, setSuccess] = useState('');


  useEffect(() => {
    fetchDevices();
    fetchDeviceTypes();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const [devicesResponse, solarDevicesResponse] = await Promise.all([
        devicesAPI.getMyDevices(),
        devicesAPI.getMySolarDevices()
      ]);
      setDevices(devicesResponse);
      setSolarDevices(solarDevicesResponse);
      setError('');
    } catch (err: any) {
      console.log('Error fetching devices:', err);
      setError('Failed to load your devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const data = await devicesAPI.getDeviceTypes();
      setDeviceTypes(data);
    } catch (err) {
      console.error('Failed to fetch device types:', err);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }
    try {
      const results = await devicesAPI.searchDevices(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    }
  };

  const activeDevices = devices.filter((device) => device.device_state === 1).length;
  const avgVoltage = solarDevices.length > 0
    ? solarDevices.reduce((sum, device) => sum + device.battery_voltage, 0) / solarDevices.length
    : 0;
  const totalPower = solarDevices.length > 0
    ? solarDevices.reduce((sum, device) => sum + (device.charging_current * device.battery_voltage), 0)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your devices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="My Solar Devices"
        description="Monitor and manage your solar battery monitoring devices"
      >
        <button
          onClick={() => setShowSolarModal(true)}
          className="bg-success hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Solar Device
        </button>
      </PageHeader>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}
       

      {/* Statistics Cards */}
      <div className="space-y-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Solar Devices" value={solarDevices.length} icon={<Package size={28} />} color="blue" subtitle="Solar chargers connected" />
          <StatsCard title="Active Devices" value={activeDevices} icon={<CheckCircle size={28} />} color="green" subtitle="Currently online" trend={activeDevices > 0 ? 5 : 0} />
          <StatsCard title="Avg Battery Voltage" value={`${avgVoltage.toFixed(1)}V`} icon={<Zap size={28} />} color="purple" subtitle="Average across devices" />
          <StatsCard title="Total Power" value={`${totalPower.toFixed(1)}W`} icon={<Battery size={28} />} color="indigo" subtitle="Current output" />
        </div>
      </div>

      {/* Solar Devices Grid */}
      {(() => {
        const displayDevices = searchQuery ? searchResults : solarDevices;
        return <SolarDevicesSection
          devices={displayDevices}
          title={searchQuery ? `Search Results for "${searchQuery}"` : "My Solar Devices"}
          showViewAllLink={false}
          maxDevices={displayDevices.length}
        />;
      })()}

      {/* Quick Actions */}
      <QuickActions />

      {/* Create Device Modal */}
      <AdvancedDeviceAddModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        deviceTypes={deviceTypes}
        onDeviceAdded={(device) => {
          setDevices([...devices, device]);
          fetchDevices();
        }}
        onError={setError}
        onSuccess={setSuccess}
      />

      {/* Add Solar Device Modal */}
      <AddSolarDeviceModal
        isOpen={showSolarModal}
        onClose={() => setShowSolarModal(false)}
        onDeviceAdded={(device) => {
          setDevices([...devices, device]);
          fetchDevices();
        }}
        onError={setError}
        onSuccess={(message) => setSuccess(message)}
      />
    </div>
  );
};