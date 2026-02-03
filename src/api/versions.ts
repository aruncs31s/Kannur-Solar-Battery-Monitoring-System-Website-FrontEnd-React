import { container } from '../application/di/container';
import { CreateVersionDTO, Version, UpdateVersionDTO, CreateFeatureDTO, Feature, UpdateFeatureDTO } from '../domain/entities/Version';

export const versionsAPI = {
  getById: async (id: string): Promise<Version> => {
    return await container.getVersionRepository().getById(id);
  },

  getAll: async (): Promise<Version[]> => {
    return await container.getVersionRepository().getAll();
  },

  create: async (data: CreateVersionDTO): Promise<Version> => {
    return await container.getVersionRepository().create(data);
  },

  update: async (id: string, data: UpdateVersionDTO): Promise<Version> => {
    return await container.getVersionRepository().update(id, data);
  },

  delete: async (id: string): Promise<void> => {
    return await container.getVersionRepository().delete(id);
  },

  createFeature: async (data: CreateFeatureDTO): Promise<Feature> => {
    return await container.getVersionRepository().createFeature(data);
  },

  getFeaturesByVersion: async (versionId: string): Promise<Feature[]> => {
    return await container.getVersionRepository().getFeaturesByVersion(versionId);
  },

  updateFeature: async (id: string, data: UpdateFeatureDTO): Promise<Feature> => {
    return await container.getVersionRepository().updateFeature(id, data);
  },

  deleteFeature: async (id: string): Promise<void> => {
    return await container.getVersionRepository().deleteFeature(id);
  },
};