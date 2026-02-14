import { CreateLocationDTO, LocationResponseDTO, UpdateLocationDTO, LocationDeviceDTO } from '../entities/Location';

export interface ILocationRepository {
  getAll(): Promise<LocationResponseDTO[]>;
  getById(id: number): Promise<LocationResponseDTO>;
  search(query: string): Promise<LocationResponseDTO[]>;
  create(location: CreateLocationDTO): Promise<{ message: string }>;
  update(id: number, location: UpdateLocationDTO): Promise<{ message: string }>;
  delete(id: number): Promise<{ message: string }>;
  getDevicesByLocation(locationId: number): Promise<LocationDeviceDTO[]>;
}