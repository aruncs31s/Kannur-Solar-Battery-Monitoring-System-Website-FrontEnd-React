import { CreateVersionDTO, Version, UpdateVersionDTO, CreateFeatureDTO, Feature, UpdateFeatureDTO } from '../entities/Version';

export interface IVersionRepository {
  getById(id: string): Promise<Version>;
  getAll(): Promise<Version[]>;
  create(data: CreateVersionDTO): Promise<Version>;
  update(id: string, data: UpdateVersionDTO): Promise<Version>;
  delete(id: string): Promise<void>;
  createFeature(data: CreateFeatureDTO): Promise<Feature>;
  getFeaturesByVersion(versionId: string): Promise<Feature[]>;
  updateFeature(id: string, data: UpdateFeatureDTO): Promise<Feature>;
  deleteFeature(id: string): Promise<void>;
}