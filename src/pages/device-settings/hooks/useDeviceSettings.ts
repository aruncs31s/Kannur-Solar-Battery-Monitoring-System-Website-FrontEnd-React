import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { devicesAPI } from '../../../api/devices';
import { DeviceOwnership, DeviceTypeDTO } from '../../../domain/entities/Device';

export const useDeviceSettings = (id: string | undefined) => {
  const navigate = useNavigate();
  const [device, setDevice] = useState<any>(null);
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeDTO[]>([]);
  const [ownership, setOwnership] = useState<DeviceOwnership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Settings forms
  const [updateForm, setUpdateForm] = useState({
    name: '',
    type: 0,
    ip_address: '',
    mac_address: '',
    firmware_version_id: 0,
    address: '',
    city: ''
  });
  
  const [updateMessage, setUpdateMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');

  // Modals
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadDeviceData();
      loadDeviceTypes();
      loadOwnership();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadDeviceData = async () => {
    try {
      const response = await devicesAPI.getDevice(id!);
      setDevice(response.device);
      setUpdateForm({
        name: response.device.name || '',
        type: parseInt(response.device.type) || 0,
        ip_address: response.device.ip_address || '',
        mac_address: response.device.mac_address || '',
        firmware_version_id: response.device.version_id || 0,
        address: response.device.address || '',
        city: response.device.city || ''
      });
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load device data');
    } finally {
      setLoading(false);
    }
  };

  const loadDeviceTypes = async () => {
    try {
      const data = await devicesAPI.getDeviceTypes();
      setDeviceTypes(data);
    } catch (err) {
      console.error('Failed to load device types:', err);
    }
  };

  const loadOwnership = async () => {
    try {
      const data = await devicesAPI.getOwnership(parseInt(id!));
      setOwnership(data);
    } catch (err) {
      console.error('Failed to load ownership info:', err);
    }
  };

  const handleUpdateDevice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage('');
    try {
      await devicesAPI.updateDevice(parseInt(id!), {
        name: updateForm.name,
        type: updateForm.type,
        ip_address: updateForm.ip_address,
        mac_address: updateForm.mac_address,
        firmware_version_id: updateForm.firmware_version_id,
        address: updateForm.address,
        city: updateForm.city
      });
      setUpdateMessage('Device properties updated successfully');
      await loadDeviceData();
    } catch (err: any) {
      setUpdateMessage(err.response?.data?.error || 'Failed to update device');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTransferOwnership = async (toUserId: number, note: string) => {
    await devicesAPI.transferOwnership(parseInt(id!), { to_user_id: toUserId, note });
    await loadOwnership();
  };

  const handleToggleVisibility = async (isPublic: boolean) => {
    try {
      await devicesAPI.setVisibility(parseInt(id!), isPublic);
      if (ownership) {
        setOwnership({ ...ownership, is_public: isPublic });
      }
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const generateToken = async () => {
    try {
      const response = await devicesAPI.generateDeviceToken(parseInt(id!));
      setGeneratedToken(response.token);
    } catch (err) {
      console.error('Failed to generate token:', err);
    }
  };

  const handleDeleteDevice = async () => {
    try {
      await devicesAPI.deleteDevice(parseInt(id!));
      navigate('/devices');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete device');
    }
  };

  return {
    device,
    deviceTypes,
    ownership,
    loading,
    error,
    updateForm,
    setUpdateForm,
    updateMessage,
    isUpdating,
    generatedToken,
    showTransferModal,
    setShowTransferModal,
    showDeleteModal,
    setShowDeleteModal,
    handleUpdateDevice,
    handleTransferOwnership,
    handleToggleVisibility,
    handleDeleteDevice,
    generateToken
  };
};
