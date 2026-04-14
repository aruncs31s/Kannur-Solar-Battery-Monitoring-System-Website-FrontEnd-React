import { useState } from "react";
import { Plus } from "lucide-react";
import { useSearchStore } from "../../store/searchStore";
import { AddDeviceModal } from "../../components/AddDeviceModal";
import { DeviceSection } from "../../components/DeviceSection";
import { FormError, FormSuccess } from "../../components/FormComponents";
import { QuickActions } from "../../components/QuickActions";
import { PageHeader } from "../../components/PageHeader";
import { MyDevicesStats } from "./components/MyDevicesStats";
import { useMyDevicesData } from "./hooks/useMyDevicesData";



export const MyDevices = () => {
  const { query: searchQuery } = useSearchStore();
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [success, setSuccess] = useState("");
  const {
    loading,
    error,
    setError,
    displayDevicesList,
    stats,
    fetchDevices,
    currentPage,
    setCurrentPage,
    pageSize,
    deviceTypes,
    deviceTypesLoading,
    selectedTypeId,
    setSelectedTypeId,
  } = useMyDevicesData({ searchQuery });

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
        title="My Devices"
        description="Monitor and manage your devices across all hardware types"
      >
        <button
          onClick={() => setShowAddDeviceModal(true)}
          className="bg-success hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Device
        </button>
      </PageHeader>
      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}
      <MyDevicesStats stats={stats} />
      {/* Devices Grid */}
      <DeviceSection
        devices={displayDevicesList}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        title={
          searchQuery ? `Search Results for "${searchQuery}"` : "My Devices"
        }
        showViewAllLink={false}
        pageSize={pageSize}
        typeFilters={deviceTypes}
        selectedTypeId={selectedTypeId}
        onTypeChange={setSelectedTypeId}
        filterLoading={deviceTypesLoading}
      />
      {/* Quick Actions */}
      <QuickActions />

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={showAddDeviceModal}
        onClose={() => setShowAddDeviceModal(false)}
        onDeviceAdded={() => {
          setCurrentPage(1);
          fetchDevices();
        }}
        onError={setError}
        onSuccess={(message) => setSuccess(message)}
      />
    </div>
  );
};
