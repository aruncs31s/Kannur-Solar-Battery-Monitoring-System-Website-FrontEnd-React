import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, RotateCcw, Zap, CheckCircle2, ChevronDown } from 'lucide-react';
import { AxisRange, ChartAxisConfig } from '../hooks/useChartAxisConfig';

interface MetricTab {
  key: 'voltage' | 'current' | 'power';
  label: string;
  unit: string;
  color: string;
  accentClass: string;
}

const METRIC_TABS: MetricTab[] = [
  { key: 'voltage', label: 'Voltage',  unit: 'V', color: '#5E81AC', accentClass: 'text-[#5E81AC]' },
  { key: 'current', label: 'Current',  unit: 'A', color: '#A3BE8C', accentClass: 'text-[#A3BE8C]' },
  { key: 'power',   label: 'Power',    unit: 'W', color: '#B48EAD', accentClass: 'text-[#B48EAD]' },
];

interface ChartAxisControlsProps {
  /** Whether the panel is expanded */
  isOpen: boolean;
  onToggle: () => void;
  axisConfig: ChartAxisConfig;
  onMetricRangeChange: (
    metric: 'voltage' | 'current' | 'power',
    range: Partial<AxisRange>
  ) => void;
  onResetMetric: (metric: 'voltage' | 'current' | 'power') => void;
  onResetAll: () => void;
  /** Chart data to compute smart suggestions */
  chartData: { voltage?: number; current?: number; power?: number }[];
  onSuggest: (
    data: { voltage?: number; current?: number; power?: number }[],
    metric: 'voltage' | 'current' | 'power'
  ) => { min: number; max: number };
  /** Which metric is currently selected in the main chart filter */
  selectedMetric: 'all' | 'voltage' | 'current' | 'power';
}

interface NumericInputProps {
  value: number | 'auto';
  placeholder: string;
  onChange: (v: number | 'auto') => void;
  color: string;
}

const NumericInput = ({ value, placeholder, onChange, color }: NumericInputProps) => {
  const [text, setText] = useState(value === 'auto' ? '' : String(value));

  useEffect(() => {
    setText(value === 'auto' ? '' : String(value));
  }, [value]);

  return (
    <input
      type="number"
      step="0.1"
      value={text}
      placeholder={placeholder}
      onChange={(e) => {
        setText(e.target.value);
        const n = parseFloat(e.target.value);
        onChange(isNaN(n) ? 'auto' : n);
      }}
      className="w-full px-2.5 py-1.5 rounded-lg border border-border-primary bg-surface-primary text-text-primary text-xs font-mono text-center focus:outline-none focus:ring-2 transition"
      style={{ '--tw-ring-color': color } as React.CSSProperties}
    />
  );
};

export const ChartAxisControls = ({
  isOpen,
  onToggle,
  axisConfig,
  onMetricRangeChange,
  onResetMetric,
  onResetAll,
  chartData,
  onSuggest,
  selectedMetric,
}: ChartAxisControlsProps) => {
  // Default the active tab to the currently filtered metric (if not 'all')
  const defaultTab =
    selectedMetric !== 'all' ? selectedMetric : 'voltage';
  const [activeTab, setActiveTab] = useState<'voltage' | 'current' | 'power'>(defaultTab);

  // Keep tab in sync when selectedMetric changes externally
  useEffect(() => {
    if (selectedMetric !== 'all') setActiveTab(selectedMetric);
  }, [selectedMetric]);

  const currentTab = METRIC_TABS.find((t) => t.key === activeTab)!;
  const currentRange = axisConfig[activeTab];
  const isCustom = currentRange.yMin !== 'auto' || currentRange.yMax !== 'auto';

  // Check how many metrics have custom ranges
  const customCount = METRIC_TABS.filter(
    (t) => axisConfig[t.key].yMin !== 'auto' || axisConfig[t.key].yMax !== 'auto'
  ).length;

  const applySuggestion = () => {
    const { min, max } = onSuggest(chartData, activeTab);
    onMetricRangeChange(activeTab, { yMin: min, yMax: max });
  };

  return (
    <div className="rounded-xl border border-border-secondary bg-surface-secondary overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={onToggle}
        className="flex items-center px-4 py-3 hover:bg-surface-tertiary transition-colors group"
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal
            size={15}
            className="text-text-secondary group-hover:text-text-primary transition-colors"
          />
          {customCount > 0 && (
            <span className="flex items-center gap-1 bg-nord-10/20 text-nord-10 text-[10px] font-bold px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} />
              {customCount} 
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {customCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); onResetAll(); }}
              className="text-[10px] text-text-muted hover:text-error px-2 py-1 rounded hover:bg-error/10 transition-all font-medium flex items-center gap-1"
            >
              <RotateCcw size={10} />
              Reset all
            </button>
          )}
          <ChevronDown
            size={16}
            className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Expandable panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border-secondary">
              {/* Metric tabs */}
              <div className="flex gap-1.5 pt-4">
                {METRIC_TABS.map((tab) => {
                  const hasCustom =
                    axisConfig[tab.key].yMin !== 'auto' ||
                    axisConfig[tab.key].yMax !== 'auto';
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        activeTab === tab.key
                          ? 'border-transparent text-white shadow-sm'
                          : 'border-border-primary bg-surface-primary text-text-secondary hover:text-text-primary'
                      }`}
                      style={
                        activeTab === tab.key
                          ? { backgroundColor: tab.color }
                          : {}
                      }
                    >
                      {tab.label}
                      {hasCustom && (
                        <span
                          className="w-1.5 h-1.5 rounded-full bg-current opacity-80"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Y-axis range inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: currentTab.color }}
                  >
                    Y-Axis Range — {currentTab.label} ({currentTab.unit})
                  </span>
                  {isCustom && (
                    <button
                      onClick={() => onResetMetric(activeTab)}
                      className="flex items-center gap-1 text-[10px] text-text-muted hover:text-error px-1.5 py-0.5 rounded hover:bg-error/10 transition-all font-medium"
                    >
                      <RotateCcw size={9} />
                      Auto
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Min {currentTab.unit}
                    </label>
                    <NumericInput
                      value={currentRange.yMin}
                      placeholder="Auto"
                      color={currentTab.color}
                      onChange={(v) => onMetricRangeChange(activeTab, { yMin: v })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      Max {currentTab.unit}
                    </label>
                    <NumericInput
                      value={currentRange.yMax}
                      placeholder="Auto"
                      color={currentTab.color}
                      onChange={(v) => onMetricRangeChange(activeTab, { yMax: v })}
                    />
                  </div>
                </div>

                {/* Quick preset buttons */}
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={applySuggestion}
                    className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-border-primary hover:border-nord-10 text-text-secondary hover:text-nord-10 transition-all bg-surface-primary"
                  >
                    <Zap size={10} />
                    Zoom to data
                  </button>

                  {/* Quick range pills based on metric */}
                  {activeTab === 'voltage' && (
                    <>
                      {[
                        { label: '10–13V', min: 10, max: 13 },
                        { label: '11–12V', min: 11, max: 12 },
                        { label: '11.5–14.5V', min: 11.5, max: 14.5 },
                        { label: '24V bank', min: 22, max: 30 },
                      ].map((p) => (
                        <button
                          key={p.label}
                          onClick={() =>
                            onMetricRangeChange(activeTab, { yMin: p.min, yMax: p.max })
                          }
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-border-primary hover:border-[#5E81AC] text-text-secondary hover:text-[#5E81AC] transition-all bg-surface-primary"
                        >
                          {p.label}
                        </button>
                      ))}
                    </>
                  )}
                  {activeTab === 'current' && (
                    <>
                      {[
                        { label: '0–5A', min: 0, max: 5 },
                        { label: '0–10A', min: 0, max: 10 },
                        { label: '0–20A', min: 0, max: 20 },
                      ].map((p) => (
                        <button
                          key={p.label}
                          onClick={() =>
                            onMetricRangeChange(activeTab, { yMin: p.min, yMax: p.max })
                          }
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-border-primary hover:border-[#A3BE8C] text-text-secondary hover:text-[#A3BE8C] transition-all bg-surface-primary"
                        >
                          {p.label}
                        </button>
                      ))}
                    </>
                  )}
                  {activeTab === 'power' && (
                    <>
                      {[
                        { label: '0–50W', min: 0, max: 50 },
                        { label: '0–100W', min: 0, max: 100 },
                        { label: '0–200W', min: 0, max: 200 },
                      ].map((p) => (
                        <button
                          key={p.label}
                          onClick={() =>
                            onMetricRangeChange(activeTab, { yMin: p.min, yMax: p.max })
                          }
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-border-primary hover:border-[#B48EAD] text-text-secondary hover:text-[#B48EAD] transition-all bg-surface-primary"
                        >
                          {p.label}
                        </button>
                      ))}
                    </>
                  )}
                </div>

                {/* Current active range summary */}
                {isCustom && (
                  <div
                    className="text-[10px] text-center py-1.5 rounded-lg font-mono font-semibold"
                    style={{
                      color: currentTab.color,
                      backgroundColor: currentTab.color + '18',
                    }}
                  >
                    Showing {currentRange.yMin === 'auto' ? 'auto' : `${currentRange.yMin}${currentTab.unit}`}
                    {' → '}
                    {currentRange.yMax === 'auto' ? 'auto' : `${currentRange.yMax}${currentTab.unit}`}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
