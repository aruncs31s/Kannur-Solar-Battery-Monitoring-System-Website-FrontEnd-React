import { useState } from 'react';
import { versionsAPI } from '../../../api/versions';
import { Feature, CreateFeatureDTO } from '../../../domain/entities/Version';

export const useFeatureForm = (onSuccess: () => void, onError: (msg: string) => void) => {
  const [showAddFeature, setShowAddFeature] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [featureForm, setFeatureForm] = useState({ name: '' });

  const handleCreateFeature = async (e: React.FormEvent, versionId: string) => {
    e.preventDefault();
    const data: CreateFeatureDTO = {
      version_id: versionId,
      name: featureForm.name,
    };
    try {
      await versionsAPI.createFeature(data);
      setFeatureForm({ name: '' });
      setShowAddFeature(false);
      onSuccess();
    } catch (err) {
      onError('Failed to create feature');
    }
  };

  const handleUpdateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature) return;
    try {
      await versionsAPI.updateFeature(editingFeature.id.toString(), {
        name: featureForm.name,
      });
      setEditingFeature(null);
      setFeatureForm({ name: '' });
      onSuccess();
    } catch (err) {
      onError('Failed to update feature');
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await versionsAPI.deleteFeature(id);
        onSuccess();
      } catch (err) {
        onError('Failed to delete feature');
      }
    }
  };

  const startEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setFeatureForm({ name: feature.name || '' });
  };

  const cancelEdit = () => {
    setEditingFeature(null);
    setFeatureForm({ name: '' });
  };

  const cancelAdd = () => {
    setShowAddFeature(false);
    setFeatureForm({ name: '' });
  };

  return {
    showAddFeature,
    editingFeature,
    featureForm,
    setShowAddFeature,
    setFeatureForm,
    handleCreateFeature,
    handleUpdateFeature,
    handleDeleteFeature,
    startEditFeature,
    cancelEdit,
    cancelAdd,
  };
};
