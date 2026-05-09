import { useState, useCallback } from 'react';

export interface VoltageRangeConfig {
  /** Fully charged / optimal high voltage */
  fullVoltage: number;
  /** Good / acceptable voltage upper band */
  goodVoltage: number;
  /** Low voltage warning threshold */
  lowVoltage: number;
  /** Critical low voltage threshold */
  criticalVoltage: number;
  /** Absolute minimum (over-discharge protection) */
  minVoltage: number;
  /** Label for the battery bank (e.g. "12V Lead-Acid") */
  label: string;
  /** Whether alerts are enabled */
  alertsEnabled: boolean;
}

export const DEFAULT_VOLTAGE_CONFIG: VoltageRangeConfig = {
  fullVoltage: 14.4,
  goodVoltage: 12.6,
  lowVoltage: 12.0,
  criticalVoltage: 11.5,
  minVoltage: 10.5,
  label: '12V Battery Bank',
  alertsEnabled: true,
};

const STORAGE_KEY_PREFIX = 'voltage_range_config_device_';

export type VoltageStatus = 'full' | 'good' | 'low' | 'critical' | 'unknown';

export const getVoltageStatus = (
  voltage: number | undefined | null,
  config: VoltageRangeConfig
): VoltageStatus => {
  if (voltage == null || isNaN(voltage)) return 'unknown';
  if (voltage >= config.goodVoltage) return 'full';
  if (voltage >= config.lowVoltage) return 'good';
  if (voltage >= config.criticalVoltage) return 'low';
  return 'critical';
};

export const getVoltagePercentage = (
  voltage: number | undefined | null,
  config: VoltageRangeConfig
): number => {
  if (voltage == null || isNaN(voltage)) return 0;
  const range = config.fullVoltage - config.minVoltage;
  if (range <= 0) return 0;
  const pct = ((voltage - config.minVoltage) / range) * 100;
  return Math.min(100, Math.max(0, pct));
};

export const useVoltageRangeConfig = (deviceId: string | undefined) => {
  const storageKey = deviceId ? `${STORAGE_KEY_PREFIX}${deviceId}` : null;

  const loadConfig = (): VoltageRangeConfig => {
    if (!storageKey) return { ...DEFAULT_VOLTAGE_CONFIG };
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return { ...DEFAULT_VOLTAGE_CONFIG, ...JSON.parse(stored) };
    } catch {
      // ignore parse errors
    }
    return { ...DEFAULT_VOLTAGE_CONFIG };
  };

  const [config, setConfig] = useState<VoltageRangeConfig>(loadConfig);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const saveConfig = useCallback(
    (newConfig: VoltageRangeConfig) => {
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(newConfig));
      }
      setConfig(newConfig);
    },
    [storageKey]
  );

  const resetConfig = useCallback(() => {
    if (storageKey) localStorage.removeItem(storageKey);
    setConfig({ ...DEFAULT_VOLTAGE_CONFIG });
  }, [storageKey]);

  return {
    config,
    showConfigModal,
    setShowConfigModal,
    saveConfig,
    resetConfig,
  };
};
