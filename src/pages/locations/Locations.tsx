import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Plus,
  Users,
  Package,
  Activity,
  Edit2,
  Trash2,
} from 'lucide-react';
import { StatsCard } from '../../components/Cards';
import { PageHeader } from '../../components/PageHeader';
import { FormError, FormSuccess } from '../../components/FormComponents';
import { Section } from '../../components/Section';
import { LocationFormModal } from './components/LocationFormModal';
import { useLocationsData } from './hooks/useLocationsData';

export const Locations = () => {
  const navigate = useNavigate();
  const {
    locations,
    loading,
    error,
    success,
    showAddModal,
    selectedLocation,
    handleAddLocation,
    handleEditLocation,
    handleDeleteLocation,
    handleSaveLocation,
    closeAddModal,
    stats
  } = useLocationsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading locations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Locations"
        description="Manage your installation locations and sites"
      >
        <button
          onClick={handleAddLocation}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Location
        </button>
      </PageHeader>

      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Locations"
          value={locations.length}
          icon={<MapPin size={24} />}
          color="blue"
        />
        <StatsCard
          title="Active Sites"
          value={stats.activeLocations}
          icon={<Activity size={24} />}
          color="green"
        />
        <StatsCard
          title="Total Devices"
          value={stats.totalDevices}
          icon={<Package size={24} />}
          color="purple"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} />}
          color="indigo"
        />
      </div>

      {/* Locations List */}
      <Section
        title="All Locations"
        description="View and manage all your locations"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
              onClick={() => navigate(`/locations/${location.id}/devices`)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <MapPin
                      className="text-primary-600 dark:text-primary-400"
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {location.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {location.city}, {location.state} • {location.code}
                    </p>
                    {location.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {location.description}
                      </p>
                    )}
                  </div>
                </div>
                <div
                  className="flex gap-2 ml-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditLocation(location);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Edit location"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLocation(location.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    title="Delete location"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin size={16} />
                  <span>
                    {location.city}, {location.state}
                  </span>
                </div>
                {location.pin_code && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    PIN: {location.pin_code}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {location.device_count || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Devices
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {location.user_count || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Users
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      location.status === 'active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : location.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {(location.status || 'unknown').charAt(0).toUpperCase() +
                      (location.status || 'unknown').slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No locations found
            </p>
            <button
              onClick={handleAddLocation}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Add your first location
            </button>
          </div>
        )}
      </Section>

      {/* Add/Edit Location Modal */}
      {showAddModal && (
        <LocationFormModal
          location={selectedLocation}
          onClose={closeAddModal}
          onSave={handleSaveLocation}
        />
      )}
    </div>
  );
};
