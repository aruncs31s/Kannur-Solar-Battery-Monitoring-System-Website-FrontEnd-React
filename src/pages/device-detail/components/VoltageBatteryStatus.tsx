import { motion } from 'framer-motion';
import { Sliders, AlertTriangle, CheckCircle, ZapOff, type LucideIcon } from 'lucide-react';
import {
  VoltageRangeConfig,
  VoltageStatus,
  getVoltageStatus,
  getVoltagePercentage,
} from '../hooks/useVoltageRangeConfig';

interface VoltageBatteryStatusProps {
  voltage: number | null | undefined;
  config: VoltageRangeConfig;
  onConfigClick: () => void;
  compact?: boolean;
}

const STATUS_META: Record<
  VoltageStatus,
  { label: string; color: string; bgColor: string; barColor: string; Icon: LucideIcon; textColorClass: string }
> = {
  full: {
    label: 'Optimal',
    color: '#A3BE8C',
    bgColor: 'rgba(163,190,140,0.12)',
    barColor: '#A3BE8C',
    textColorClass: 'text-[#A3BE8C]',
    Icon: CheckCircle,
  },
  good: {
    label: 'Good',
    color: '#88C0D0',
    bgColor: 'rgba(136,192,208,0.12)',
    barColor: '#88C0D0',
    textColorClass: 'text-[#88C0D0]',
    Icon: CheckCircle,
  },
  low: {
    label: 'Low',
    color: '#EBCB8B',
    bgColor: 'rgba(235,203,139,0.12)',
    barColor: '#EBCB8B',
    textColorClass: 'text-[#EBCB8B]',
    Icon: AlertTriangle,
  },
  critical: {
    label: 'Critical',
    color: '#BF616A',
    bgColor: 'rgba(191,97,106,0.12)',
    barColor: '#BF616A',
    textColorClass: 'text-[#BF616A]',
    Icon: AlertTriangle,
  },
  unknown: {
    label: 'No Data',
    color: '#888',
    bgColor: 'rgba(100,100,100,0.08)',
    barColor: '#888',
    textColorClass: 'text-text-muted',
    Icon: ZapOff,
  },
};

export const VoltageBatteryStatus = ({
  voltage,
  config,
  onConfigClick,
  compact = false,
}: VoltageBatteryStatusProps) => {
  const status = getVoltageStatus(voltage, config);
  const pct = getVoltagePercentage(voltage, config);
  const meta = STATUS_META[status];
  const Icon = meta.Icon;

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all hover:opacity-90"
        style={{
          backgroundColor: meta.bgColor,
          borderColor: meta.color,
        }}
        onClick={onConfigClick}
        title="Configure voltage ranges"
      >
        <Icon size={14} className={meta.textColorClass} />
        <span className={`text-xs font-bold ${meta.textColorClass}`}>
          {meta.label}
        </span>
        {voltage != null && (
          <span className="text-xs font-mono text-text-muted">
            {voltage.toFixed(2)}V
          </span>
        )}
        <Sliders size={12} className="text-text-muted ml-0.5" />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border p-4 space-y-3"
      style={{ backgroundColor: meta.bgColor, borderColor: meta.color + '55' }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={16} className={meta.textColorClass} />
          <span className={`text-sm font-bold ${meta.textColorClass}`}>
            {meta.label}
          </span>
          <span className="text-xs text-text-muted">— {config.label}</span>
        </div>
        <button
          onClick={onConfigClick}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary px-2 py-1 rounded-lg hover:bg-surface-secondary transition-all"
          title="Configure voltage ranges"
        >
          <Sliders size={12} />
          Configure
        </button>
      </div>

      {/* Battery bar */}
      <div className="relative h-4 rounded-full bg-surface-secondary border border-border-secondary overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: meta.barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        {/* Tick marks for thresholds */}
        {[config.criticalVoltage, config.lowVoltage, config.goodVoltage].map((thresh) => {
          const tpct = getVoltagePercentage(thresh, config);
          return (
            <div
              key={thresh}
              className="absolute top-0 bottom-0 w-0.5 bg-surface-primary/50"
              style={{ left: `${tpct}%` }}
            />
          );
        })}
      </div>

      {/* Voltage labels */}
      <div className="flex items-center justify-between text-[10px] text-text-muted">
        <span>{config.minVoltage}V</span>
        <span
          className="font-bold text-xs tabular-nums"
          style={{ color: meta.color }}
        >
          {voltage != null ? `${voltage.toFixed(2)}V` : '—'} ({Math.round(pct)}%)
        </span>
        <span>{config.fullVoltage}V</span>
      </div>
    </div>
  );
};
