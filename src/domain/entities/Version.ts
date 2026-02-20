export interface Version {
  id: string | number;
  name?: string;
  Version?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  Features?: Feature[] | null;
}

export interface CreateVersionDTO {
  name: string;
  description?: string;
}

export interface UpdateVersionDTO {
  name?: string;
  description?: string;
}

export interface Feature {
  id: string | number;
  ID?: number;
  version_id?: string;
  name?: string;
  FeatureName?: string;
  description?: string;
  Enabled?: boolean;
  created_at?: string;
  updated_at?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface CreateFeatureDTO {
  version_id: string;
  name: string;
  description?: string;
}

export interface UpdateFeatureDTO {
  name?: string;
  description?: string;
}