import { useState } from "react";
import { Plus } from "lucide-react";
import { useSearchStore } from "../../store/searchStore";
import { AddSolarDeviceModal } from "../../components/AddSolarDeviceModal";
import { SolarDevicesSection } from "../../components/SolarDevicesSection";
import { FormError, FormSuccess } from "../../components/FormComponents";
import { QuickActions } from "../../components/QuickActions";
import { PageHeader } from "../../components/PageHeader";
import { MyDevicesStats } from "./components/MyDevicesStats";
import { useMyDevicesData } from "./hooks/useMyDevicesData";

export const MyDevices = () => {
  const { query: searchQuery } = useSearchStore();
  const [showSolarModal, setShowSolarModal] = useState(false);
  const [success, setSuccess] = useState("");
  const {
    loading,
    error,
    setError,
    displayDevicesList,
    stats,
    fetchDevices,
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
      <MyDevicesStats stats={stats} />
      {/* Solar Devices Grid */}
      <SolarDevicesSection
        devices={displayDevicesList}
        title={
          searchQuery ? `Search Results for "${searchQuery}"` : "My Solar Devices"
        }
        showViewAllLink={false}
        pageSize={6}
      />
      {/* Quick Actions */}
      <QuickActions />

      {/* Add Solar Device Modal */}
      <AddSolarDeviceModal
        isOpen={showSolarModal}
        onClose={() => setShowSolarModal(false)}
        onDeviceAdded={() => {
          fetchDevices(); // Refetch to maintain sorted order
        }}
        onError={setError}
        onSuccess={(message) => setSuccess(message)}
      />
    </div>
  );
};
