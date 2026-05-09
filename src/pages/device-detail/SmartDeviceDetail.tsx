/**
 * SmartDeviceDetail
 *
 * A thin routing wrapper that lives at `/devices/:id`.
 * It fetches just enough device metadata to know what kind of hardware it is,
 * then delegates to the appropriate detail page:
 *
 *   hardware_type 1 or 2 (Microcontroller / SBC)  → MCDeviceDetail
 *   everything else                                → DeviceDetail
 *
 * This replaces the old split between /devices/:id and /devices/mc/:id,
 * so every link can simply navigate to /devices/<id>.
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { devicesAPI } from '../../api/devices';
import { isMicrocontroller } from '../../components/ui/DeviceTypeIcon';
import { DeviceDetail } from './DeviceDetail';
import { MCDeviceDetail } from '../microcontroller-detail/MicrocontrollerDetail';

type HardwareType = number | null;

export const SmartDeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [hardwareType, setHardwareType] = useState<HardwareType>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (!id) return;

    devicesAPI
      .getDevice(id)
      .then((res) => {
        // The API returns device.hardware_type directly from the device_type join
        const ht: number = res?.device?.hardware_type ?? 0;
        setHardwareType(ht);
      })
      .catch(() => {
        // On error fall through to DeviceDetail which will show its own error state
        setHardwareType(0);
      })
      .finally(() => setResolved(true));
  }, [id]);

  // While resolving, render nothing (each sub-page has its own loading state,
  // so we hand off immediately once we know the type).
  if (!resolved) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading device…</div>
      </div>
    );
  }

  // Microcontroller (1) or Single Board Computer (2) → MC detail view
  if (isMicrocontroller(hardwareType ?? 0)) {
    return <MCDeviceDetail />;
  }

  // Sensor, actuator, solar charger, etc. → generic device detail
  return <DeviceDetail />;
};
