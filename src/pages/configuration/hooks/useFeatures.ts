import { useState, useEffect } from 'react';
import { versionsAPI } from '../../../api/versions';
import { Feature, CreateFeatureDTO } from '../../../domain/entities/Version';

export const useFeatures = (versionId: string) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [error, setError] = useState('');

  const fetchFeatures = async () => {
    if (!versionId) return;
    try {
      const response = await versionsAPI.getFeaturesByVersion(versionId);
      setFeatures(response);
    } catch (err) {
      setError('Failed to fetch features');
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [versionId]);

  const createFeature = async (data: CreateFeatureDTO) => {
    await versionsAPI.createFeature(data);
    await fetchFeatures();
  };

  const updateFeature = async (id: string, data: Partial<CreateFeatureDTO>) => {
    await versionsAPI.updateFeature(id, data);
    await fetchFeatures();
  };

  const deleteFeature = async (id: string) => {
    await versionsAPI.deleteFeature(id);
    await fetchFeatures();
  };

  return { features, error, setError, createFeature, updateFeature, deleteFeature };
};
