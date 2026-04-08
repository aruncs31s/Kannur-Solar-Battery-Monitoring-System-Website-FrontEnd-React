import { useEffect, useState } from 'react';
import { readingsAPI } from '../../../api/readings';
import { devicesAPI } from '../../../api/devices';
import { ConnectedDeviceDTO, DeviceTypeDTO } from '../../../domain/entities/Device';
import { Reading } from '../../../domain/entities/Reading';

export const useDeviceDetailData = (id: string | undefined) => {
  const [device, setDevice] = useState<{
    id: number;
    name: string;
    type: string;
    ip_address: string;
    mac_address: string;
    firmware_version: string;
    address: string;
    city: string;
    device_state: number;
  } | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [controlMessage, setControlMessage] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [readingsLimit] = useState(20);

  // Update device modal state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
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
  const [deviceTypes, setDeviceTypes] = useState<DeviceTypeDTO[]>([]);
  const [deviceType, setDeviceType] = useState<DeviceTypeDTO | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDeviceDTO[]>([]);
  const [showAddConnectedModal, setShowAddConnectedModal] = useState(false);

  // Connected device readings modal state
  const [selectedConnectedDevice, setSelectedConnectedDevice] = useState<ConnectedDeviceDTO | null>(null);
  const [showConnectedReadingsModal, setShowConnectedReadingsModal] = useState(false);
  const [connectedDeviceReadings, setConnectedDeviceReadings] = useState<Reading[]>([]);
  const [loadingConnectedReadings, setLoadingConnectedReadings] = useState(false);

  // State for automatic connected device readings display
  const [singleConnectedReading, setSingleConnectedReading] = useState<Reading | null>(null);
  const [multipleConnectedReadings, setMultipleConnectedReadings] = useState<{ [deviceId: number]: Reading | null }>({});
  const [expandedDevices, setExpandedDevices] = useState<{ [deviceId: number]: boolean }>({});
  const [loadingSingleReading, setLoadingSingleReading] = useState(false);
  const [loadingMultipleReadings, setLoadingMultipleReadings] = useState(false);

  const getDefaultDates = () => {
    const today = new Date();
    return {
      start: today.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };

  const defaultDates = getDefaultDates();
  const [startDate] = useState(defaultDates.start);
  const [endDate] = useState(defaultDates.end);
  const [useDateFilter] = useState(false);
  const [allReadings, setAllReadings] = useState<Reading[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'voltage' | 'current' | 'power'>('all');

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (id) {
      loadDeviceData();
      loadReadings();
      loadDeviceTypes();
      loadDeviceType();
      loadConnectedDevices();

      intervalId = setInterval(() => {
        if (isMounted) {
          loadDeviceData();
          loadReadings();
        }
      }, 30000);
    }

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, readingsLimit, startDate, endDate, useDateFilter]);

  useEffect(() => {
    if (connectedDevices.length > 0) {
      loadAutomaticConnectedReadings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedDevices]);

  const loadDeviceTypes = async () => {
    try {
      const data = await devicesAPI.getDeviceTypes();
      setDeviceTypes(data);
    } catch (err) {
      console.error('Failed to load device types:', err);
    }
  };

  const loadDeviceType = async () => {
    if (!id) return;
    try {
      const data = await devicesAPI.getDeviceType(parseInt(id));
      setDeviceType(data);
    } catch (err) {
      console.error('Failed to load device type:', err);
    }
  };

  const loadConnectedDevices = async () => {
    if (!id) return;
    try {
      const data = await devicesAPI.getConnectedDevices(parseInt(id));
      setConnectedDevices(data);
    } catch (err) {
      console.error('Failed to load connected devices:', err);
    }
  };

  const handleConnectedDeviceClick = async (device: ConnectedDeviceDTO) => {
    setSelectedConnectedDevice(device);
    setShowConnectedReadingsModal(true);
    setLoadingConnectedReadings(true);

    try {
      const data = await readingsAPI.getByDevice(device.id.toString());
      const sortedReadings = data.sort((a: Reading, b: Reading) => b.timestamp - a.timestamp);
      setConnectedDeviceReadings(sortedReadings.slice(0, 5));
    } catch (err) {
      console.error('Failed to load connected device readings:', err);
      setConnectedDeviceReadings([]);
    } finally {
      setLoadingConnectedReadings(false);
    }
  };

  const closeConnectedReadingsModal = () => {
    setShowConnectedReadingsModal(false);
    setSelectedConnectedDevice(null);
    setConnectedDeviceReadings([]);
  };

  const loadAutomaticConnectedReadings = async () => {
    const supportedDevices = connectedDevices.filter(d => d.hardware_type === 1);

    if (supportedDevices.length === 0) {
      setSingleConnectedReading(null);
      setMultipleConnectedReadings({});
      return;
    }

    if (supportedDevices.length === 1) {
      setLoadingSingleReading(true);
      try {
        const deviceReadings = await readingsAPI.getByDevice(supportedDevices[0].id.toString(), 1);
        setSingleConnectedReading(deviceReadings.length > 0 ? deviceReadings[0] : null);
      } catch (err) {
        console.error('Failed to load single connected device reading:', err);
        setSingleConnectedReading(null);
      } finally {
        setLoadingSingleReading(false);
      }
    } else {
      setLoadingMultipleReadings(true);
      try {
        const readingsMap: { [deviceId: number]: Reading | null } = {};
        await Promise.all(
          supportedDevices.map(async (dev) => {
            try {
              const deviceReadings = await readingsAPI.getByDevice(dev.id.toString(), 1);
              readingsMap[dev.id] = deviceReadings.length > 0 ? deviceReadings[0] : null;
            } catch (err) {
              console.error(`Failed to load readings for device ${dev.id}:`, err);
              readingsMap[dev.id] = null;
            }
          })
        );
        setMultipleConnectedReadings(readingsMap);
        const expanded: { [deviceId: number]: boolean } = {};
        supportedDevices.forEach(d => expanded[d.id] = true);
        setExpandedDevices(expanded);
      } catch (err) {
        console.error('Failed to load multiple connected device readings:', err);
        setMultipleConnectedReadings({});
      } finally {
        setLoadingMultipleReadings(false);
      }
    }
  };

  const loadDeviceData = async () => {
    try {
      const data = await devicesAPI.getDevice(id!);
      setDevice(data.device);
      setError('');
    } catch (err) {
      setError('Failed to load device information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadReadings = async () => {
    if (!id) return;

    try {
      let data: Reading[];

      if (useDateFilter) {
        data = await readingsAPI.getByDateRange({
          deviceId: id,
          startDate: startDate,
          endDate: endDate
        });
      } else {
        data = await readingsAPI.getByDevice(id);
      }

      const sortedReadings = data.sort((a: Reading, b: Reading) => b.timestamp - a.timestamp);
      const minReadings = Math.max(readingsLimit, 10);
      setReadings(sortedReadings.slice(0, minReadings));

      // Fetch last 7 days for breakdown charts
      const last7DaysEnd = new Date();
      last7DaysEnd.setDate(last7DaysEnd.getDate() + 1);
      const last7DaysStart = new Date();
      last7DaysStart.setDate(last7DaysStart.getDate() - 7);

      const breakdownData = await readingsAPI.getByDateRange({
        deviceId: id,
        startDate: last7DaysStart.toISOString().split('T')[0],
        endDate: last7DaysEnd.toISOString().split('T')[0]
      });
      setAllReadings(breakdownData);
    } catch (err) {
      console.error('Failed to load readings:', err);
    }
  };

  const generateToken = async () => {
    if (!id) return;

    try {
      const response = await devicesAPI.generateDeviceToken(parseInt(id));
      setGeneratedToken(response.token);
      setShowTokenModal(true);
    } catch (err: any) {
      setControlMessage('Failed to generate token');
      setTimeout(() => setControlMessage(''), 3000);
      console.error('Token generation error:', err);
    }
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setGeneratedToken('');
  };

  const openUpdateModal = () => {
    if (device) {
      const deviceTypeObj = deviceTypes.find(type => type.name === device.type);
      setUpdateForm({
        name: device.name,
        type: deviceTypeObj?.id || 1,
        ip_address: device.ip_address,
        mac_address: device.mac_address,
        firmware_version_id: 1,
        address: device.address,
        city: device.city
      });
      setShowUpdateModal(true);
      setUpdateMessage('');
    }
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdateMessage('');
  };

  const handleUpdateDevice = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await devicesAPI.updateDevice(parseInt(id!), updateForm);
      setUpdateMessage('Device updated successfully!');
      setTimeout(() => {
        loadDeviceData();
        closeUpdateModal();
      }, 1500);
    } catch (err) {
      setUpdateMessage('Failed to update device');
      console.error(err);
    }
  };

  const controlDevice = async (action: number) => {
    if (!id) {
      console.error('Device ID is missing');
      setControlMessage('Error: Device ID not found');
      return;
    }

    try {
      const deviceId = parseInt(id, 10);
      if (isNaN(deviceId)) {
        throw new Error(`Invalid device ID: ${id}`);
      }

      console.log(`Sending control action: ${action} for device: ${deviceId}`);
      const response = await devicesAPI.controlDevice(deviceId, action);
      console.log('Control response:', response);

      if (response && response.success === true) {
        const actionNames: { [key: number]: string } = {
          4: 'turned on',
          5: 'turned off',
          6: 'configured',
        };
        const message = `Device ${actionNames[action] || 'action completed'} successfully!`;
        console.log('Setting control message:', message);
        setControlMessage(message);

        setTimeout(() => {
          console.log('Reloading device data...');
          loadDeviceData();
          setControlMessage('');
        }, 2000);
      } else {
        const errorMsg = response?.message || 'Control action failed';
        console.warn('Control action failed:', errorMsg, 'Response:', response);
        setControlMessage(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Error in controlDevice:', err);
      setControlMessage(`Error: ${errorMsg}`);
    }
  };

  const getStatusType = (stateId: number, isOnline: boolean): 'active' | 'inactive' | 'maintenance' | 'decommissioned' | 'unknown' | 'online' => {
    if (isOnline) return 'online';
    const states: { [key: number]: any } = { 1: 'active', 2: 'inactive', 3: 'maintenance', 4: 'decommissioned' };
    return states[stateId] || 'unknown';
  };

  const isDeviceOnline = (): boolean => {
    if (readings.length === 0) return false;
    const latestReading = readings[0];
    const now = new Date().getTime();
    const tenMinutesInMs = 10 * 60 * 1000;
    return (now - latestReading.timestamp) <= tenMinutesInMs;
  };

  const getLatestReading = () => readings.length > 0 ? readings[0] : null;

  const getAverages = () => {
    if (selectedDay) {
      const dayData = getDailyBreakdown().find(day => day.date === selectedDay);
      if (dayData) {
        return {
          voltage: dayData.avgVoltage,
          current: dayData.avgCurrent,
          power: dayData.avgPower
        };
      }
    }
    if (readings.length === 0) return { voltage: 0, current: 0, power: 0 };
    const sum = readings.reduce(
      (acc, r) => ({
        voltage: acc.voltage + (r.voltage ?? 0),
        current: acc.current + (r.current ?? 0),
        power: acc.power + (r.power ?? 0),
      }),
      { voltage: 0, current: 0, power: 0 }
    );
    return {
      voltage: sum.voltage / readings.length,
      current: sum.current / readings.length,
      power: sum.power / readings.length,
    };
  };

  const getAggregateChartData = () => {
    const chartData = readings
      .slice(0, 100)
      .reverse()
      .map(reading => ({
        time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voltage: reading.voltage ?? 0,
        current: reading.current ?? 0,
        power: reading.power ?? 0,
        timestamp: reading.timestamp
      }));

    if (selectedMetric !== 'all') {
      const avgValue = selectedMetric === 'voltage' ? getAverages().voltage :
        selectedMetric === 'current' ? getAverages().current : getAverages().power;
      chartData.forEach((dataPoint: any) => {
        dataPoint[`${selectedMetric}Avg`] = avgValue;
      });
    }

    return chartData;
  };

  const getDailyBreakdown = () => {
    const dailyData: { [key: string]: Reading[] } = {};

    allReadings.forEach(reading => {
      const date = new Date(reading.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      if (!dailyData[date]) dailyData[date] = [];
      dailyData[date].push(reading);
    });

    const result = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const dayReadings = dailyData[dateString] || [];
      result.push({
        date: dateString,
        readings: dayReadings.sort((a, b) => a.timestamp - b.timestamp),
        chartData: dayReadings
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(r => ({
            time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            voltage: r.voltage ?? 0,
            current: r.current ?? 0,
            power: r.power ?? 0
          })),
        avgVoltage: dayReadings.length > 0 ? dayReadings.reduce((sum, r) => sum + (r.voltage ?? 0), 0) / dayReadings.length : 0,
        avgCurrent: dayReadings.length > 0 ? dayReadings.reduce((sum, r) => sum + (r.current ?? 0), 0) / dayReadings.length : 0,
        avgPower: dayReadings.length > 0 ? dayReadings.reduce((sum, r) => sum + (r.power ?? 0), 0) / dayReadings.length : 0,
        count: dayReadings.length
      });
    }

    return result;
  };

  const getDetailedChartData = () => {
    if (!selectedDay) return [];
    const dayData = getDailyBreakdown().find(day => day.date === selectedDay);
    if (!dayData) return [];
    const chartData = dayData.chartData;

    if (selectedMetric !== 'all') {
      const avgValue = selectedMetric === 'voltage' ? dayData.avgVoltage :
        selectedMetric === 'current' ? dayData.avgCurrent : dayData.avgPower;
      chartData.forEach((dataPoint: any) => {
        dataPoint[`${selectedMetric}Avg`] = avgValue;
      });
    }

    return chartData;
  };

  return {
    device,
    readings,
    loading,
    error,
    controlMessage,
    showTokenModal,
    generatedToken,
    showUpdateModal,
    updateForm,
    setUpdateForm,
    updateMessage,
    deviceTypes,
    deviceType,
    connectedDevices,
    showAddConnectedModal,
    setShowAddConnectedModal,
    selectedConnectedDevice,
    showConnectedReadingsModal,
    connectedDeviceReadings,
    loadingConnectedReadings,
    singleConnectedReading,
    multipleConnectedReadings,
    expandedDevices,
    setExpandedDevices,
    loadingSingleReading,
    loadingMultipleReadings,
    allReadings,
    selectedDay,
    setSelectedDay,
    selectedMetric,
    setSelectedMetric,
    generateToken,
    closeTokenModal,
    openUpdateModal,
    closeUpdateModal,
    handleUpdateDevice,
    controlDevice,
    getStatusType,
    isDeviceOnline,
    getLatestReading,
    getAverages,
    getAggregateChartData,
    getDailyBreakdown,
    getDetailedChartData,
    loadConnectedDevices,
    handleConnectedDeviceClick,
    closeConnectedReadingsModal,
    loadDeviceData,
    loadReadings,
    setControlMessage
  };
};
