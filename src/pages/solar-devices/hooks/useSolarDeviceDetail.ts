import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { httpClient } from '../../../infrastructure/http/HttpClient';
import { devicesAPI } from '../../../api/devices';
import { DeviceResponseDTO, ConnectedDeviceDTO, DeviceTypeDTO, DEVICE_STATE_MAPPING } from '../../../domain/entities/Device';
import { Reading } from '../../../domain/entities/Reading';
import { isSensor } from '../../../components/ui/DeviceTypeIcon';
import { MCWithSensors } from '../types';

export const useSolarDeviceDetail = () => {
  const { id } = useParams<{ id: string }>();

  const [device, setDevice] = useState<DeviceResponseDTO | null>(null);
  const [microcontrollers, setMicrocontrollers] = useState<MCWithSensors[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  
  const [showAddMCModal, setShowAddMCModal] = useState(false);
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeDTO[]>([]);

  const loadDeviceTypes = useCallback(async () => {
    try {
      const types = await devicesAPI.getDeviceTypes();
      setDeviceTypes(types);
    } catch { }
  }, []);

  const loadDevice = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const resp = await httpClient.get<{ device: any }>(`/devices/${id}`);
      const d = resp.device;
      const stateId = d.current_state || d.device_state || 1;
      setDevice({
        id: d.id,
        name: d.name,
        type: d.type || '',
        ip_address: d.ip_address || d.details?.ip_address || '',
        mac_address: d.mac_address || d.details?.mac_address || '',
        firmware_version: d.firmware_version || '',
        version_id: d.version_id || 0,
        address: d.details?.address || '',
        city: d.details?.city || '',
        device_state: stateId,
        status: d.status || DEVICE_STATE_MAPPING[stateId] || 'unknown',
        hardware_type: d.device_type?.hardware_type ?? 4,
      });
    } catch (err: any) {
      setError('Failed to load device');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadHierarchy = useCallback(async () => {
    try {
      // Load connected devices (should be microcontrollers)
      const mcResp = await httpClient.get<{ connected_devices: ConnectedDeviceDTO[] }>(`/devices/${id}/connected`);
      const connectedDevices = mcResp.connected_devices || [];

      // For each MC, load its connected sensors
      const mcWithSensors: MCWithSensors[] = await Promise.all(
        connectedDevices.map(async (mc) => {
          let sensors: ConnectedDeviceDTO[] = [];
          let latestReading: Reading | null = null;

          try {
            const sensResp = await httpClient.get<{ connected_devices: ConnectedDeviceDTO[] }>(
              `/devices/${mc.id}/connected`
            );
            sensors = (sensResp.connected_devices || []).filter(d =>
              isSensor(d.hardware_type ?? 3) || (d.hardware_type === undefined)
            );
          } catch { /* MC may have no sensors yet */ }

          try {
            const readResp = await httpClient.get<{ readings: any[] }>(
              `/devices/${mc.id}/readings/progressive`
            );
            const rds = readResp.readings || [];
            if (rds.length > 0) {
              const last = rds[rds.length - 1];
              latestReading = {
                id: `${mc.id}-latest`,
                deviceId: mc.id.toString(),
                voltage: last.voltage,
                current: last.current,
                avg_voltage: last.avg_voltage,
                avg_current: last.avg_current,
                power: (last.voltage || 0) * (last.current || 0),
                timestamp: new Date(last.created_at).getTime(),
              };
            }
          } catch { /* no readings yet */ }

          return { ...mc, sensors, latestReading, expanded: connectedDevices.length === 1 };
        })
      );
      setMicrocontrollers(mcWithSensors);
    } catch (err: any) {
      // ignore, hierarchy may be empty
    }
  }, [id]);

  const loadReadings = useCallback(async () => {
    try {
      const resp = await httpClient.get<{ readings: any[] }>(`/devices/${id}/readings/progressive`);
      const rds = (resp.readings || []).map((r: any, idx: number) => ({
        id: `${id}-${idx}`,
        deviceId: id!,
        voltage: r.voltage,
        current: r.current,
        avg_voltage: r.avg_voltage,
        avg_current: r.avg_current,
        power: (r.voltage || 0) * (r.current || 0),
        timestamp: new Date(r.created_at).getTime(),
      }));
      setReadings(rds);
    } catch { /* no readings */ }
  }, [id]);

  useEffect(() => {
    loadDevice();
    loadHierarchy();
    loadReadings();
    loadDeviceTypes();
  }, [id, refreshKey, loadDevice, loadHierarchy, loadReadings, loadDeviceTypes]);

  const toggleMC = (mcId: number) => {
    setMicrocontrollers(prev =>
      prev.map(mc => mc.id === mcId ? { ...mc, expanded: !mc.expanded } : mc)
    );
  };

  const refresh = () => setRefreshKey(k => k + 1);

  return {
    id,
    device,
    microcontrollers,
    readings,
    loading,
    error,
    showTokenModal,
    setShowTokenModal,
    generatedToken,
    setGeneratedToken,
    showAddMCModal,
    setShowAddMCModal,
    deviceTypes,
    toggleMC,
    refresh
  };
};
