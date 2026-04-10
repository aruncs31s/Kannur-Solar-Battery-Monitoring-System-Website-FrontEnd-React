import { StatsCard } from '../../components/Cards';
import { AllDevicesSection } from '../../components/AllDevicesSection';
import { Package, CheckCircle, Zap, Battery, Plus } from 'lucide-react';
import { FormError, FormSuccess } from '../../components/FormComponents';
import { AdvancedDeviceAddModal } from '../../components/AdvancedDeviceAddModal';
import { PageHeader } from '../../components/PageHeader';
import { useDevicesData } from './hooks/useDevicesData';

export const Devices = () => {
  const {
    devices,
    loading,
    error,
    setError,
    success,
    setSuccess,
    deviceTypes,
    searchQuery,
    searchResults,
    showAddModal,
    setShowAddModal,
    handleDeviceAdded,
    activeDevicesCount
  } = useDevicesData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-vh-50 py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
        <div className="text-lg font-medium text-text-secondary">Syncing with device registry...</div>
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
          <StatsCard title="Active Devices" value={activeDevicesCount} icon={<CheckCircle size={28} />} color="green" subtitle="Currently online" trend={activeDevicesCount > 0 ? 5 : 0} />
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
