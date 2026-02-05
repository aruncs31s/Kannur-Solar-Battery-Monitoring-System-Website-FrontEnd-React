import { useEffect, useState } from 'react';
import { useDevicesStore } from '../store/devicesStore';
import { devicesAPI } from '../api/devices';
import { StatsCard } from '../components/Cards';
import { AllDevicesSection } from '../components/AllDevicesSection';
import { Package, CheckCircle, Zap, Battery, Plus } from 'lucide-react';
import { FormError, FormSuccess } from '../components/FormComponents';
import { useSearchStore } from '../store/searchStore';
import { AdvancedDeviceAddModal } from '../components/AdvancedDeviceAddModal';
import { PageHeader } from '../components/PageHeader';

export const Devices = () => {
  const { devices, setDevices } = useDevicesStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const { query: searchQuery } = useSearchStore();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDevices();
    fetchDeviceTypes();
  }, []);

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

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await devicesAPI.getAllDevices();
      setDevices(response);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch devices');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeviceTypes = async () => {
    try {
      const deviceTypes = await devicesAPI.getDeviceTypes();
      setDeviceTypes(deviceTypes);
    } catch (err) {
      console.error('Failed to fetch device types:', err);
    }
  };

  const handleDeviceAdded = (newDevice: any) => {
    setDevices([...devices, newDevice]);
    fetchDevices(); // Refresh to get updated data
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading devices...</div>
      </div>
    );
  }

  return (
   
    <div className="space-y-8">
      <PageHeader
        title="Devices"
        description="Manage and monitor your ESP32 devices"
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Device
        </button>
      </PageHeader>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      {/* Statistics Cards */}
      <div className="space-y-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Total Devices" value={devices.length} icon={<Package size={28} />} color="blue" subtitle="Connected devices" />
          <StatsCard title="Active Devices" value={devices.filter(d => d.device_state === 1).length} icon={<CheckCircle size={28} />} color="green" subtitle="Currently online" trend={devices.filter(d => d.device_state === 1).length > 0 ? 5 : 0} />
          <StatsCard title="Avg Voltage" value="0V" icon={<Zap size={28} />} color="purple" subtitle="System average" />
          <StatsCard title="Total Power" value="0W" icon={<Battery size={28} />} color="indigo" subtitle="Current output" />
        </div>
      </div>

      {/* Devices List */}
      <AllDevicesSection 
        devices={searchQuery ? searchResults : devices} 
        showGenerateToken={true} 
        title="All Devices" 
        showViewAllLink={false} 
        maxDevices={(searchQuery ? searchResults : devices).length} 
      />

      {/* Add Device Modal */}
      <AdvancedDeviceAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        deviceTypes={deviceTypes}
        onDeviceAdded={handleDeviceAdded}
        onError={setError}
        onSuccess={setSuccess}
      />
    </div>
  );
};
