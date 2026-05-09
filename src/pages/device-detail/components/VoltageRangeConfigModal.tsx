import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, RotateCcw, Save, Zap, Info } from 'lucide-react';
import { VoltageRangeConfig, DEFAULT_VOLTAGE_CONFIG } from '../hooks/useVoltageRangeConfig';

interface VoltageRangeConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: VoltageRangeConfig;
  onSave: (config: VoltageRangeConfig) => void;
  onReset: () => void;
}

interface FieldConfig {
  key: keyof VoltageRangeConfig;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  unit: string;
  min: number;
  max: number;
  step: number;
}

const VOLTAGE_FIELDS: FieldConfig[] = [
  {
    key: 'fullVoltage',
    label: 'Full / Optimal Voltage',
    description: 'Voltage at or above this is considered fully charged',
    color: '#A3BE8C',
    bgColor: 'rgba(163,190,140,0.1)',
    unit: 'V',
    min: 8,
    max: 60,
    step: 0.1,
  },
  {
    key: 'goodVoltage',
    label: 'Good Voltage',
    description: 'Above this threshold = battery is in good shape',
    color: '#88C0D0',
    bgColor: 'rgba(136,192,208,0.1)',
    unit: 'V',
    min: 8,
    max: 60,
    step: 0.1,
  },
  {
    key: 'lowVoltage',
    label: 'Low Voltage Warning',
    description: 'Below this triggers a low-battery warning',
    color: '#EBCB8B',
    bgColor: 'rgba(235,203,139,0.1)',
    unit: 'V',
    min: 5,
    max: 60,
    step: 0.1,
  },
  {
    key: 'criticalVoltage',
    label: 'Critical Voltage Alert',
    description: 'Below this triggers a critical alert',
    color: '#D08770',
    bgColor: 'rgba(208,135,112,0.1)',
    unit: 'V',
    min: 5,
    max: 60,
    step: 0.1,
  },
  {
    key: 'minVoltage',
    label: 'Minimum Voltage (0%)',
    description: 'Absolute minimum — used to calculate battery percentage',
    color: '#BF616A',
    bgColor: 'rgba(191,97,106,0.1)',
    unit: 'V',
    min: 0,
    max: 60,
    step: 0.1,
  },
];

const PRESETS: { label: string; config: Partial<VoltageRangeConfig> }[] = [
  {
    label: '12V Lead-Acid',
    config: {
      fullVoltage: 14.4,
      goodVoltage: 12.6,
      lowVoltage: 12.0,
      criticalVoltage: 11.5,
      minVoltage: 10.5,
      label: '12V Lead-Acid',
    },
  },
  {
    label: '12V LiFePO4',
    config: {
      fullVoltage: 14.6,
      goodVoltage: 13.2,
      lowVoltage: 12.8,
      criticalVoltage: 12.4,
      minVoltage: 10.0,
      label: '12V LiFePO4',
    },
  },
  {
    label: '24V Lead-Acid',
    config: {
      fullVoltage: 28.8,
      goodVoltage: 25.2,
      lowVoltage: 24.0,
      criticalVoltage: 23.0,
      minVoltage: 21.0,
      label: '24V Lead-Acid',
    },
  },
  {
    label: '48V LiFePO4',
    config: {
      fullVoltage: 58.4,
      goodVoltage: 52.8,
      lowVoltage: 51.2,
      criticalVoltage: 48.0,
      minVoltage: 40.0,
      label: '48V LiFePO4',
    },
  },
];

export const VoltageRangeConfigModal = ({
  isOpen,
  onClose,
  config,
  onSave,
  onReset,
}: VoltageRangeConfigModalProps) => {
  const [form, setForm] = useState<VoltageRangeConfig>({ ...config });
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({ ...config });
      setSavedFlash(false);
    }
  }, [isOpen, config]);

  const handleFieldChange = (key: keyof VoltageRangeConfig, value: number | string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null);
  };

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setForm((prev) => ({ ...prev, ...preset.config }));
    setActivePreset(preset.label);
  };

  const handleSave = () => {
    onSave(form);
    setSavedFlash(true);
    setTimeout(() => {
      setSavedFlash(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setForm({ ...DEFAULT_VOLTAGE_CONFIG });
    setActivePreset(null);
    onReset();
  };

  // Preview bar — shows where the current thresholds sit visually
  const previewBands = () => {
    const total = form.fullVoltage - form.minVoltage;
    if (total <= 0) return [];
    const pct = (v: number) => Math.min(100, Math.max(0, ((v - form.minVoltage) / total) * 100));

    return [
      { label: 'Critical', from: 0, to: pct(form.criticalVoltage), color: '#BF616A' },
      { label: 'Low', from: pct(form.criticalVoltage), to: pct(form.lowVoltage), color: '#D08770' },
      { label: 'Warning', from: pct(form.lowVoltage), to: pct(form.goodVoltage), color: '#EBCB8B' },
      { label: 'Good', from: pct(form.goodVoltage), to: pct(form.fullVoltage), color: '#88C0D0' },
      { label: 'Full', from: pct(form.fullVoltage), to: 100, color: '#A3BE8C' },
    ];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative bg-surface-primary rounded-2xl shadow-2xl border border-border-primary w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-primary bg-gradient-to-r from-nord-10/10 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-nord-10/20 rounded-xl">
                  <Sliders size={20} className="text-nord-10" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">Voltage Range Configuration</h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Set thresholds for battery status &amp; alerts
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-surface-secondary text-text-muted hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
              {/* Battery label */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Battery Bank Label
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => handleFieldChange('label', e.target.value)}
                  placeholder="e.g. 12V Lead-Acid Bank"
                  className="w-full px-4 py-2.5 rounded-xl border border-border-primary bg-surface-secondary text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-nord-10/50 transition"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => applyPreset(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        activePreset === preset.label
                          ? 'bg-nord-10 text-white border-nord-10 shadow-md shadow-nord-10/30'
                          : 'bg-surface-secondary border-border-secondary text-text-secondary hover:border-nord-10 hover:text-nord-10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual preview bar */}
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Zap size={12} />
                  Visual Range Preview
                </label>
                <div className="relative h-8 rounded-xl overflow-hidden flex border border-border-secondary shadow-inner">
                  {previewBands().map((band) => (
                    <div
                      key={band.label}
                      style={{
                        width: `${band.to - band.from}%`,
                        backgroundColor: band.color,
                        opacity: band.to - band.from > 1 ? 1 : 0,
                      }}
                      className="transition-all duration-300 relative group flex items-center justify-center"
                    >
                      {band.to - band.from > 8 && (
                        <span className="text-[9px] font-bold text-white/90 uppercase tracking-wider select-none">
                          {band.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-text-muted">{form.minVoltage}V</span>
                  <span className="text-[10px] text-text-muted">{form.fullVoltage}V</span>
                </div>
              </div>

              {/* Threshold fields */}
              <div className="space-y-4">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                  Thresholds
                </label>
                {VOLTAGE_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="rounded-xl border border-border-secondary p-4 transition-all hover:border-border-primary"
                    style={{ backgroundColor: field.bgColor }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: field.color }}
                        >
                          {field.label}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">{field.description}</p>
                      </div>
                      <div
                        className="text-lg font-bold tabular-nums ml-4 min-w-[70px] text-right"
                        style={{ color: field.color }}
                      >
                        {Number(form[field.key]).toFixed(1)}
                        <span className="text-xs ml-0.5">{field.unit}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-text-muted w-12 text-right">
                        {field.min}{field.unit}
                      </span>
                      <input
                        type="range"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={Number(form[field.key])}
                        onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value))}
                        className="flex-1 accent-current h-1.5 cursor-pointer"
                        style={{ accentColor: field.color }}
                      />
                      <span className="text-[10px] text-text-muted w-12">
                        {field.max}{field.unit}
                      </span>
                      {/* Number input */}
                      <input
                        type="number"
                        min={field.min}
                        max={field.max}
                        step={field.step}
                        value={Number(form[field.key])}
                        onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 rounded-lg border border-border-primary bg-surface-primary text-text-primary text-xs text-center font-mono focus:outline-none focus:ring-2 transition"
                        style={{ focusRingColor: field.color } as React.CSSProperties}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Alerts toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-secondary border border-border-secondary">
                <div className="flex items-center gap-3">
                  <Info size={16} className="text-text-secondary" />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Enable Voltage Alerts</p>
                    <p className="text-xs text-text-muted">Show warning banners when voltage is out of range</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFieldChange('alertsEnabled', !form.alertsEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                    form.alertsEnabled ? 'bg-nord-10' : 'bg-surface-tertiary border border-border-primary'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                      form.alertsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border-primary bg-surface-secondary">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-error rounded-xl hover:bg-error/10 transition-all font-medium"
              >
                <RotateCcw size={14} />
                Reset to Defaults
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-sm text-text-secondary bg-surface-primary hover:bg-surface-tertiary border border-border-primary rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-5 py-2 text-sm rounded-xl font-semibold transition-all ${
                    savedFlash
                      ? 'bg-success text-white scale-95'
                      : 'bg-nord-10 hover:bg-nord-10/90 text-white shadow-md shadow-nord-10/30 hover:-translate-y-0.5'
                  }`}
                >
                  <Save size={14} />
                  {savedFlash ? 'Saved!' : 'Save Configuration'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
