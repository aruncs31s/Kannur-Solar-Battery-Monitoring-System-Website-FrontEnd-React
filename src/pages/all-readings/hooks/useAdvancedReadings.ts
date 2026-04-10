import { useState, useEffect, useCallback } from 'react';
import { GetAdvancedReadingsUseCase } from '../../../application/usecases/readings/GetAdvancedReadingsUseCase';
import { ReadingRepository } from '../../../infrastructure/repositories/ReadingRepository';
import { AdvancedReadingFilterDTO, AdvancedReadingViewDTO } from '../../../domain/entities/Reading';
import { LocationResponseDTO } from '../../../domain/entities/Location';
import { LocationRepository } from '../../../infrastructure/repositories/LocationRepository';

export const useAdvancedReadings = () => {
  const [readings, setReadings] = useState<AdvancedReadingViewDTO[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  const [locations, setLocations] = useState<LocationResponseDTO[]>([]);

  // Default limit to 500
  const [filters, setFilters] = useState<AdvancedReadingFilterDTO>({ limit: 500 });
  const [appliedFilters, setAppliedFilters] = useState<AdvancedReadingFilterDTO>({ limit: 500 });

  useEffect(() => {
    // Load locations for the dropdown
    const fetchLocations = async () => {
      try {
        const repo = new LocationRepository();
        const locs = await repo.getAll();
        setLocations(locs);
      } catch (err) {
        console.error("Failed to load locations", err);
      }
    };
    fetchLocations();
  }, []);

  const loadReadings = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const repo = new ReadingRepository();
      const useCase = new GetAdvancedReadingsUseCase(repo);
      
      const response = await useCase.execute(appliedFilters);
      setReadings(response.readings);
      setTotal(response.total);
    } catch (err: any) {
      console.error('Failed to load advanced readings:', err);
      setError(err.response?.data?.error || 'Failed to load readings');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadReadings();
  }, [loadReadings]);

  const handleFilterChange = (key: keyof AdvancedReadingFilterDTO, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    const defaultFilters = { limit: 500 };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return {
    readings,
    total,
    loading,
    error,
    locations,
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
    refreshReadings: loadReadings
  };
};
