import React from 'react';
import { Sun, Cpu, Radio, Zap, Thermometer, Activity, ToggleRight, HelpCircle } from 'lucide-react';

// Maps backend HardwareType enum values to display info
export const HARDWARE_TYPES = {
  0: { label: 'Unknown', icon: HelpCircle, color: 'var(--text-muted)', bg: 'var(--surface-tertiary)', cssClass: '' },
  1: { label: 'Microcontroller', icon: Cpu, color: 'var(--mc-color)', bg: 'var(--mc-bg)', cssClass: 'badge-micro' },
  2: { label: 'Single Board Computer', icon: Cpu, color: 'var(--mc-color)', bg: 'var(--mc-bg)', cssClass: 'badge-micro' },
  3: { label: 'Sensor', icon: Radio, color: 'var(--sensor-color)', bg: 'var(--sensor-bg)', cssClass: 'badge-sensor' },
  4: { label: 'Solar Charger', icon: Sun, color: 'var(--solar-color)', bg: 'var(--solar-bg)', cssClass: 'badge-solar' },
  5: { label: 'Voltage Meter', icon: Zap, color: 'var(--sensor-color)', bg: 'var(--sensor-bg)', cssClass: 'badge-sensor' },
  6: { label: 'Current Sensor', icon: Activity, color: 'var(--sensor-color)', bg: 'var(--sensor-bg)', cssClass: 'badge-sensor' },
  7: { label: 'Power Meter', icon: Thermometer, color: 'var(--sensor-color)', bg: 'var(--sensor-bg)', cssClass: 'badge-sensor' },
  8: { label: 'Actuator', icon: ToggleRight, color: 'var(--actuator-color)', bg: 'var(--actuator-bg)', cssClass: 'badge-actuator' },
} as const;

export type HardwareTypeKey = keyof typeof HARDWARE_TYPES;

interface DeviceTypeIconProps {
  hardwareType: number;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export const DeviceTypeIcon: React.FC<DeviceTypeIconProps> = ({
  hardwareType,
  size = 18,
  showLabel = false,
  className = '',
}) => {
  const type = HARDWARE_TYPES[hardwareType as HardwareTypeKey] ?? HARDWARE_TYPES[0];
  const Icon = type.icon;

  if (showLabel) {
    return (
      <span
        className={`badge ${type.cssClass} ${className}`}
        style={{ gap: '0.3rem' }}
      >
        <Icon size={12} />
        {type.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg ${className}`}
      style={{
        background: type.bg,
        color: type.color,
        width: size + 12,
        height: size + 12,
        minWidth: size + 12,
      }}
      title={type.label}
    >
      <Icon size={size} />
    </span>
  );
};

export const getHardwareTypeInfo = (hardwareType: number) => {
  return HARDWARE_TYPES[hardwareType as HardwareTypeKey] ?? HARDWARE_TYPES[0];
};

export const isSolarDevice = (hardwareType: number) => hardwareType === 4;
export const isMicrocontroller = (hardwareType: number) => hardwareType === 1 || hardwareType === 2;
export const isSensor = (hardwareType: number) => [3, 5, 6, 7].includes(hardwareType);
export const isActuator = (hardwareType: number) => hardwareType === 8;
