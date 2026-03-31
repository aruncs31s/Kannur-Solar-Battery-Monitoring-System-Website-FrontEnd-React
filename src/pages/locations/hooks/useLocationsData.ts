import { useState, useEffect } from 'react';
import { locationsAPI } from '../../../api/locations';
import {
  LocationResponseDTO,
  CreateLocationDTO,
  UpdateLocationDTO,
} from '../../../domain/entities/Location';

export const useLocationsData = () => {
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
    setSelectedLocation(null);
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

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedLocation(null);
  };

  const activeLocations = locations.filter((loc) => loc.status === 'active').length;
  const totalDevices = locations.reduce((sum, loc) => sum + (loc.device_count || 0), 0);
  const totalUsers = locations.reduce((sum, loc) => sum + (loc.user_count || 0), 0);

  return {
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
    stats: {
      activeLocations,
      totalDevices,
      totalUsers,
    }
  };
};
