export interface Version {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
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
  id: string;
  version_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
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