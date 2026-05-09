import { useState, useCallback } from 'react';

export interface AxisRange {
  yMin: number | 'auto';
  yMax: number | 'auto';
}

export interface ChartAxisConfig {
  voltage: AxisRange;
  current: AxisRange;
  power: AxisRange;
  /** Currently active metric for the axis panel */
  activeMetric: 'voltage' | 'current' | 'power';
}

const STORAGE_KEY_PREFIX = 'chart_axis_config_device_';

const DEFAULT_CONFIG: ChartAxisConfig = {
  voltage: { yMin: 'auto', yMax: 'auto' },
  current: { yMin: 'auto', yMax: 'auto' },
  power:   { yMin: 'auto', yMax: 'auto' },
  activeMetric: 'voltage',
};

export const useChartAxisConfig = (deviceId: string | undefined) => {
  const storageKey = deviceId ? `${STORAGE_KEY_PREFIX}${deviceId}` : null;

  const loadConfig = (): ChartAxisConfig => {
    if (!storageKey) return { ...DEFAULT_CONFIG };
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch { /* ignore */ }
    return { ...DEFAULT_CONFIG };
  };

  const [axisConfig, setAxisConfig] = useState<ChartAxisConfig>(loadConfig);
  const [showAxisPanel, setShowAxisPanel] = useState(false);

  const saveAxisConfig = useCallback(
    (next: ChartAxisConfig) => {
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
      setAxisConfig(next);
    },
    [storageKey]
  );

  const setMetricRange = useCallback(
    (metric: 'voltage' | 'current' | 'power', range: Partial<AxisRange>) => {
      setAxisConfig((prev) => {
        const next = {
          ...prev,
          [metric]: { ...prev[metric], ...range },
        };
        if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
        return next;
      });
    },
    [storageKey]
  );

  const resetMetricRange = useCallback(
    (metric: 'voltage' | 'current' | 'power') => {
      setMetricRange(metric, { yMin: 'auto', yMax: 'auto' });
    },
    [setMetricRange]
  );

  const resetAll = useCallback(() => {
    const next = { ...DEFAULT_CONFIG };
    if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next));
    setAxisConfig(next);
  }, [storageKey]);

  /**
   * Compute smart Y-domain suggestions from actual chart data.
   * Returns { min, max } rounded nicely.
   */
  const computeSuggestedRange = useCallback(
    (
      data: { voltage?: number; current?: number; power?: number }[],
      metric: 'voltage' | 'current' | 'power'
    ): { min: number; max: number } => {
      const values = data
        .map((d) => d[metric] ?? null)
        .filter((v): v is number => v !== null && !isNaN(v));

      if (values.length === 0) return { min: 0, max: 10 };

      const rawMin = Math.min(...values);
      const rawMax = Math.max(...values);
      const padding = (rawMax - rawMin) * 0.1 || 0.5;

      const round = (v: number, dir: 'floor' | 'ceil') => {
        const factor = 10;
        return dir === 'floor'
          ? Math.floor((v - padding) * factor) / factor
          : Math.ceil((v + padding) * factor) / factor;
      };

      return {
        min: round(rawMin, 'floor'),
        max: round(rawMax, 'ceil'),
      };
    },
    []
  );

  /**
   * Get the recharts domain tuple for a given metric.
   * Returns undefined when both are auto (recharts handles it).
   */
  const getYDomain = useCallback(
    (
      metric: 'voltage' | 'current' | 'power'
    ): [number | 'auto', number | 'auto'] | undefined => {
      const r = axisConfig[metric];
      if (r.yMin === 'auto' && r.yMax === 'auto') return undefined;
      return [r.yMin, r.yMax];
    },
    [axisConfig]
  );

  /**
   * Merged Y-domain for "all" metrics view — union of voltage/current/power domains.
   * Returns undefined to let recharts auto-scale.
   */
  const getAllYDomain = useCallback(():
    | [number | 'auto', number | 'auto']
    | undefined => {
    const ranges = ['voltage', 'current', 'power'] as const;
    const mins = ranges.map((m) => axisConfig[m].yMin).filter((v) => v !== 'auto') as number[];
    const maxs = ranges.map((m) => axisConfig[m].yMax).filter((v) => v !== 'auto') as number[];
    if (mins.length === 0 && maxs.length === 0) return undefined;
    return [
      mins.length > 0 ? Math.min(...mins) : 'auto',
      maxs.length > 0 ? Math.max(...maxs) : 'auto',
    ];
  }, [axisConfig]);

  return {
    axisConfig,
    showAxisPanel,
    setShowAxisPanel,
    saveAxisConfig,
    setMetricRange,
    resetMetricRange,
    resetAll,
    computeSuggestedRange,
    getYDomain,
    getAllYDomain,
  };
};
