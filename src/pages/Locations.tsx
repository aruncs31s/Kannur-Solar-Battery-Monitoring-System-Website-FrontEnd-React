import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Plus, Users, Package, Activity, Edit2, Trash2 } from 'lucide-react';
import { StatsCard } from '../components/Cards';
import { PageHeader } from '../components/PageHeader';
import { FormError, FormSuccess } from '../components/FormComponents';
import { Section } from '../components/Section';
import { Modal } from '../components/Modal';
import { locationsAPI } from '../api/locations';
import { LocationResponseDTO, CreateLocationDTO, UpdateLocationDTO } from '../domain/entities/Location';

export const Locations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<LocationResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationResponseDTO | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await locationsAPI.getAllLocations();
      setLocations(response);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch locations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = () => {
    setShowAddModal(true);
  };

  const handleEditLocation = (location: LocationResponseDTO) => {
    setSelectedLocation(location);
    setShowAddModal(true);
  };

  const handleDeleteLocation = async (locationId: number) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await locationsAPI.deleteLocation(locationId);
        setSuccess('Location deleted successfully');
        await fetchLocations(); // Refresh the list
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: any) {
        setError('Failed to delete location');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handleSaveLocation = async (locationData: Partial<LocationResponseDTO>) => {
    try {
      if (selectedLocation) {
        // Update existing location
        const updateData: UpdateLocationDTO = {
          name: locationData.name,
          description: locationData.description,
          code: locationData.code,
          city: locationData.city,
          state: locationData.state,
          pin_code: locationData.pin_code,
        };
        await locationsAPI.updateLocation(selectedLocation.id, updateData);
        setSuccess('Location updated successfully');
        await fetchLocations(); // Refresh the list
      } else {
        // Add new location
        const createData: CreateLocationDTO = {
          name: locationData.name!,
          description: locationData.description,
          code: locationData.code!,
          city: locationData.city,
          state: locationData.state,
          pin_code: locationData.pin_code,
        };
        await locationsAPI.createLocation(createData);
        setSuccess('Location added successfully');
        await fetchLocations(); // Refresh the list
      }
      setShowAddModal(false);
      setSelectedLocation(null);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Failed to save location');
      setTimeout(() => setError(''), 3000);
    }
  };

  const activeLocations = locations.filter((loc) => loc.status === 'active').length;
  const totalDevices = locations.reduce((sum, loc) => sum + (loc.device_count || 0), 0);
  const totalUsers = locations.reduce((sum, loc) => sum + (loc.user_count || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading locations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="Locations" description="Manage your installation locations and sites">
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
          value={activeLocations}
          icon={<Activity size={24} />}
          color="green"
        />
        <StatsCard
          title="Total Devices"
          value={totalDevices}
          icon={<Package size={24} />}
          color="purple"
        />
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={<Users size={24} />}
          color="indigo"
        />
      </div>

      {/* Locations List */}
      <Section title="All Locations" description="View and manage all your locations">
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
                    <MapPin className="text-primary-600 dark:text-primary-400" size={24} />
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
                <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
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
                  <span>{location.city}, {location.state}</span>
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
                    <div className="text-xs text-gray-600 dark:text-gray-400">Devices</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {location.user_count || 0}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
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
                    {(location.status || 'unknown').charAt(0).toUpperCase() + (location.status || 'unknown').slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No locations found</p>
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
          onClose={() => {
            setShowAddModal(false);
            setSelectedLocation(null);
          }}
          onSave={handleSaveLocation}
        />
      )}
    </div>
  );
};

// Location Form Modal Component
interface LocationFormModalProps {
  location: LocationResponseDTO | null;
  onClose: () => void;
  onSave: (location: Partial<LocationResponseDTO>) => void;
}

const LocationFormModal = ({ location, onClose, onSave }: LocationFormModalProps) => {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    description: location?.description || '',
    code: location?.code || '',
    city: location?.city || '',
    state: location?.state || '',
    pin_code: location?.pin_code || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'latitude' || name === 'longitude' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={location ? 'Edit Location' : 'Add New Location'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Kannur Solar Farm A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTextareaChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Optional description of the location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., KANNUR001"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              State *
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="State"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            PIN Code
          </label>
          <input
            type="text"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="PIN Code"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {location ? 'Update Location' : 'Add Location'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
