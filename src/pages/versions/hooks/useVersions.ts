import { useState, useEffect } from 'react';
import { versionsAPI } from '../../../api/versions';
import { devicesAPI } from '../../../api/devices';
import { Version, Feature } from '../../../domain/entities/Version';
import { Device } from '../../../domain/entities/Device';

const normalizeVersion = (version: any): Version => ({
  id: version.ID || version.id,
  name: version.Version || version.name,
  description: version.description,
  CreatedAt: version.CreatedAt || version.created_at,
  UpdatedAt: version.UpdatedAt || version.updated_at,
  Features: version.Features,
});

const normalizeFeature = (feature: any): Feature => ({
  id: feature.ID || feature.id,
  name: feature.FeatureName || feature.name,
  Enabled: feature.Enabled ?? true,
  description: feature.description,
  version_id: feature.version_id,
  CreatedAt: feature.CreatedAt || feature.created_at,
  UpdatedAt: feature.UpdatedAt || feature.updated_at,
});

export const useVersions = () => {
  const [versions, setVersions] = useState<Version[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedVersion) {
      fetchFeatures(selectedVersion.id);
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (selectedDevice && versions.length > 0) {
      const deviceVersion = versions.find(v => v.id === selectedDevice.version_id.toString());
      if (deviceVersion) {
        setSelectedVersion(deviceVersion);
      }
    }
  }, [selectedDevice, versions]);

  const fetchData = async () => {
    try {
      const [versionsResponse, devicesResponse] = await Promise.all([
        versionsAPI.getAll(),
        devicesAPI.getAllDevices()
      ]);
      setVersions(versionsResponse.map(normalizeVersion));
      setDevices(devicesResponse);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const fetchFeatures = async (versionId: string | number) => {
    try {
      const version = versions.find(v => v.id === versionId);
      if (version?.Features && version.Features.length > 0) {
        setFeatures(version.Features.map(normalizeFeature));
      } else {
        const response = await versionsAPI.getFeaturesByVersion(versionId.toString());
        setFeatures(response.map(normalizeFeature));
      }
    } catch (err) {
      setError('Failed to fetch features');
    }
  };

  const getDevicesByVersion = (versionId: string | number) => {
    return devices.filter(d => d.version_id.toString() === versionId.toString());
  };

  return {
    versions,
    devices,
    features,
    selectedDevice,
    selectedVersion,
    error,
    setSelectedDevice,
    setSelectedVersion,
    setError,
    fetchFeatures,
    getDevicesByVersion,
  };
};
