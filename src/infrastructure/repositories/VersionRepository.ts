import { IVersionRepository } from '../../domain/repositories/IVersionRepository';
import { CreateVersionDTO, Version, UpdateVersionDTO, CreateFeatureDTO, Feature, UpdateFeatureDTO } from '../../domain/entities/Version';
import { httpClient } from '../http/HttpClient';

export class VersionRepository implements IVersionRepository {
  async getById(id: string): Promise<Version> {
    const response = await httpClient.get<any>(`/versions/${id}`);
    return {
      id: response.ID.toString(),
      name: response.Version,
      description: '', // No description
      created_at: response.CreatedAt,
      updated_at: response.UpdatedAt,
    };
  }

  async getAll(): Promise<Version[]> {
    const response = await httpClient.get<{ versions: any[] }>('/versions');
    return response.versions.map(dto => ({
      id: dto.ID.toString(),
      name: dto.Version,
      description: '', // No description in response
      created_at: dto.CreatedAt,
      updated_at: dto.UpdatedAt,
    }));
  }

  async create(data: CreateVersionDTO): Promise<Version> {
    const response = await httpClient.post<any>('/versions', { version: data.name });
    return {
      id: response.ID.toString(),
      name: response.Version,
      description: '', // No description
      created_at: response.CreatedAt,
      updated_at: response.UpdatedAt,
    };
  }

  async update(id: string, data: UpdateVersionDTO): Promise<Version> {
    const response = await httpClient.put<any>(`/versions/${id}`, { version: data.name });
    return {
      id: response.ID.toString(),
      name: response.Version,
      description: '', // No description
      created_at: response.CreatedAt,
      updated_at: response.UpdatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/versions/${id}`);
  }

  async createFeature(data: CreateFeatureDTO): Promise<Feature> {
    const response = await httpClient.post<any>('/features', { 
      version_id: parseInt(data.version_id), 
      name: data.name,
      enabled: true
    });
    return {
      id: response.ID.toString(),
      version_id: response.VersionID.toString(),
      name: response.FeatureName,
      description: '', // No description
      created_at: '', // No created_at
      updated_at: '',
    };
  }

  async getFeaturesByVersion(versionId: string): Promise<Feature[]> {
    const response = await httpClient.get<{ features: any[] }>('/features/version/' + versionId);
    return response.features.map(dto => ({
      id: dto.ID.toString(),
      version_id: dto.VersionID.toString(),
      name: dto.FeatureName,
      description: '', // No description in response
      created_at: '', // No created_at in response
      updated_at: '',
    }));
  }

  async updateFeature(id: string, data: UpdateFeatureDTO): Promise<Feature> {
    const response = await httpClient.put<any>(`/features/${id}`, { 
      name: data.name,
      enabled: true
    });
    return {
      id: response.ID.toString(),
      version_id: response.VersionID.toString(),
      name: response.FeatureName,
      description: '', // No description
      created_at: '', // No created_at
      updated_at: '',
    };
  }

  async deleteFeature(id: string): Promise<void> {
    await httpClient.delete(`/features/${id}`);
  }
}