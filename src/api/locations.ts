import { container } from '../application/di/container';
import { CreateLocationDTO, LocationResponseDTO, UpdateLocationDTO, LocationDeviceDTO } from '../domain/entities/Location';

export const locationsAPI = {
  getAllLocations: async (): Promise<LocationResponseDTO[]> => {
    return await container.getGetAllLocationsUseCase().execute();
  },

  getLocation: async (id: number): Promise<LocationResponseDTO> => {
    return await container.getGetLocationUseCase().execute(id);
  },

  searchLocations: async (query: string): Promise<LocationResponseDTO[]> => {
    return await container.getSearchLocationsUseCase().execute(query);
  },

  createLocation: async (location: CreateLocationDTO): Promise<{ message: string }> => {
    return await container.getCreateLocationUseCase().execute(location);
  },

  updateLocation: async (id: number, location: UpdateLocationDTO): Promise<{ message: string }> => {
    return await container.getUpdateLocationUseCase().execute(id, location);
  },

  deleteLocation: async (id: number): Promise<{ message: string }> => {
    return await container.getDeleteLocationUseCase().execute(id);
  },

  getDevicesByLocation: async (locationId: number): Promise<LocationDeviceDTO[]> => {
    return await container.getGetDevicesByLocationUseCase().execute(locationId);
  },
};