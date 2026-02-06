import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { devicesAPI } from '../api/devices';
import { MicrocontrollerDTO } from '../domain/entities/Device';
import { useSearchStore } from '../store/searchStore';
import { MicrocontrollersSection } from '../components/MicrocontrollersSection';
import { StatsCard } from '../components/Cards';
import { FormError, FormSuccess } from '../components/FormComponents';
import { QuickActions } from '../components/QuickActions';
import { AdvancedDeviceAddModal } from '../components/AdvancedDeviceAddModal';
import { PageHeader } from '../components/PageHeader';
import {
  CheckCircle,
  Cpu,
  Activity,
  Wifi,
} from 'lucide-react';

export const MyMicrocontrollers = () => {
  const [microcontrollers, setMicrocontrollers] = useState<MicrocontrollerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const { query: searchQuery } = useSearchStore();
  const [searchResults, setSearchResults] = useState<MicrocontrollerDTO[]>([]);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMicrocontrollers();
    fetchDeviceTypes();
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery]);

  const fetchMicrocontrollers = async () => {
    setLoading(true);
    try {
      const data = await devicesAPI.getMicrocontrollers();
      // Sort microcontrollers by ID in descending order (newest first)
      const sortedMicrocontrollers = data.sort((a, b) => b.id - a.id);
      setMicrocontrollers(sortedMicrocontrollers);
      setError('');
    } catch (err: any) {
      console.log('Error fetching microcontrollers:', err);
      setError('Failed to load your microcontrollers');
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
      const results = await devicesAPI.searchMicrocontrollers(query);
      // Map search results to MicrocontrollerDTO format
      const microcontrollerResults = microcontrollers.filter(mc => 
        results.some(r => r.id === mc.id)
      );
      setSearchResults(microcontrollerResults);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    }
  };

  const activeDevices = microcontrollers.filter((mc) => mc.status?.toLowerCase() === "active" || mc.status?.toLowerCase() === "online").length;
  const connectedDevices = microcontrollers.filter((mc) => mc.used_by || mc.connected_sensors).length;
  const avgFirmwareVersion = microcontrollers.length > 0
    ? `v${microcontrollers[0].firmware_version || '0.0.0'}`
    : 'N/A';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading your microcontrollers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="My Microcontrollers"
        description="Monitor and manage your ESP32 and other microcontroller devices"
      >
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Microcontroller
        </button>
      </PageHeader>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      {/* Statistics Cards */}
      <div className="space-y-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Microcontrollers" 
            value={microcontrollers.length} 
            icon={<Cpu size={28} />} 
            color="blue" 
            subtitle="ESP32 and other MCUs" 
          />
          <StatsCard 
            title="Active Devices" 
            value={activeDevices} 
            icon={<CheckCircle size={28} />} 
            color="green" 
            subtitle="Currently online" 
            trend={activeDevices > 0 ? 5 : 0} 
          />
          <StatsCard 
            title="Connected Devices" 
            value={connectedDevices} 
            icon={<Wifi size={28} />} 
            color="purple" 
            subtitle="With active connections" 
          />
          <StatsCard 
            title="Firmware Version" 
            value={avgFirmwareVersion} 
            icon={<Activity size={28} />} 
            color="indigo" 
            subtitle="Latest version" 
          />
        </div>
      </div>

      {/* Microcontrollers Grid */}
      {(() => {
        const displayDevices = searchQuery ? searchResults : microcontrollers;
        return <MicrocontrollersSection
          devices={displayDevices}
          title={searchQuery ? `Search Results for "${searchQuery}"` : "My Microcontrollers"}
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
        onDeviceAdded={() => {
          fetchMicrocontrollers(); // Refetch to maintain sorted order
        }}
        onError={setError}
        onSuccess={setSuccess}
      />
    </div>
  );
};
