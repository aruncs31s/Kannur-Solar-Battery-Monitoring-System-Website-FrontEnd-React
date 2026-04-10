import { X, Calendar, Activity, RotateCcw } from 'lucide-react';
import { DEVICE_STATES, DEVICE_STATE_IDS } from '../../../domain/entities/Device';

export interface HistoryFiltersProps {
  fromDate: string;
  toDate: string;
  selectedStates: number[];
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onStatesChange: (states: number[]) => void;
  onClearFilters: () => void;
}

export const HistoryFilters = ({
  fromDate,
  toDate,
  selectedStates,
  onFromDateChange,
  onToDateChange,
  onStatesChange,
  onClearFilters,
}: HistoryFiltersProps) => {
  const allStates = [
    { id: DEVICE_STATE_IDS.ACTIVE, label: 'Active', color: 'bg-success-500' },
    { id: DEVICE_STATE_IDS.INACTIVE, label: 'Inactive', color: 'bg-error-500' },
    { id: DEVICE_STATE_IDS.MAINTENANCE, label: 'Maintenance', color: 'bg-warning-500' },
    { id: DEVICE_STATE_IDS.DECOMMISSIONED, label: 'Decommissioned', color: 'bg-nord-3' },
    { id: DEVICE_STATE_IDS.INITIALIZED, label: 'Initialized', color: 'bg-primary-500' },
  ];

  return (
    <div className="card-body p-6 space-y-6 animate-slide-down border-b border-border-primary mb-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Activity size={20} className="text-primary-500" />
          Filter Timeline
        </h2>
        <button 
          onClick={onClearFilters}
          className="text-xs font-bold text-primary-500 hover:text-primary-400 flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          <RotateCcw size={12} />
          Reset All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
            <Calendar size={14} />
            From Date
          </label>
          <input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="input-field w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
            <Calendar size={14} />
            To Date
          </label>
          <input
            type="datetime-local"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="input-field w-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-widest text-text-tertiary">
          Target States
        </label>
        <div className="flex flex-wrap gap-2">
          {allStates.map((state) => (
            <button
              key={state.id}
              onClick={() => {
                if (selectedStates.includes(state.id)) {
                  onStatesChange(selectedStates.filter((s) => s !== state.id));
                } else {
                  onStatesChange([...selectedStates, state.id]);
                }
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold transition-all duration-300 ${
                selectedStates.includes(state.id)
                  ? 'bg-primary-500/10 border-primary-500 text-primary-500 bg-surface-tertiary shadow-sm'
                  : 'bg-surface-secondary border-border-primary text-text-tertiary hover:bg-surface-tertiary hover:text-text-secondary'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${state.color}`} />
              {state.label}
              {selectedStates.includes(state.id) && <X size={12} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
