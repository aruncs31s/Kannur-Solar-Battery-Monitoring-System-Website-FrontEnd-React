import { AllDevicesSection } from '../../components/AllDevicesSection';
import { Plus } from 'lucide-react';
import { FormError, FormSuccess } from '../../components/FormComponents';
import { AdvancedDeviceAddModal } from '../../components/AdvancedDeviceAddModal';
import { PageHeader } from '../../components/PageHeader';
import { useDevicesData } from './hooks/useDevicesData';
import { DevicesStats } from './components/DevicesStats';

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
    deviceStats,
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

      <DevicesStats
        totalDevices={deviceStats?.total_devices || 0}
        activeDevicesCount={deviceStats?.active_devices || 0}
        avgVoltage={deviceStats ? `${deviceStats.avg_voltage}V` : '0V'}
        totalPower={deviceStats ? `${deviceStats.avg_power}W` : '0W'}
      />

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
