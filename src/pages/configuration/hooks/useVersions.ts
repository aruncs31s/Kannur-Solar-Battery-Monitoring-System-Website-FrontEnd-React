import { useState, useEffect } from 'react';
import { versionsAPI } from '../../../api/versions';
import { Version, CreateVersionDTO } from '../../../domain/entities/Version';

export const useVersions = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [error, setError] = useState('');

  const fetchVersions = async () => {
    try {
      const response = await versionsAPI.getAll();
      setVersions(response);
      setError('');
    } catch (err) {
      setError('Failed to fetch versions');
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const createVersion = async (data: CreateVersionDTO) => {
    await versionsAPI.create(data);
    await fetchVersions();
  };

  const updateVersion = async (id: string, data: Partial<CreateVersionDTO>) => {
    await versionsAPI.update(id, data);
    await fetchVersions();
  };

  const deleteVersion = async (id: string) => {
    await versionsAPI.delete(id);
    await fetchVersions();
  };

  return { versions, error, setError, createVersion, updateVersion, deleteVersion };
};
