import { Clock, CheckCircle, XCircle, Info, Settings, Plus, Play, Pause } from 'lucide-react';
import { DeviceStateHistoryEntry } from '../../../domain/entities/Device';

export interface HistoryListProps {
  history: DeviceStateHistoryEntry[];
}

export const HistoryList = ({ history }: HistoryListProps) => {
  if (history.length === 0) {
    return (
      <div className="card-body flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mb-4">
          <Clock className="text-text-tertiary" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No State History Found</h3>
        <p className="text-text-tertiary max-w-sm">
          We couldn't find any state change records for this device matching your criteria.
        </p>
      </div>
    );
  }

  const getStatusIcon = (stateName: string) => {
    const name = stateName.toLowerCase();
    if (name.includes('active')) return <CheckCircle className="text-success-500" size={20} />;
    if (name.includes('inactive')) return <XCircle className="text-error-500" size={20} />;
    if (name.includes('initialized')) return <Info className="text-primary-500" size={20} />;
    if (name.includes('maintenance')) return <Settings className="text-warning-500" size={20} />;
    return <Clock className="text-text-tertiary" size={20} />;
  };

  const getActionIcon = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('create')) return <Plus size={14} />;
    if (act.includes('turn_on')) return <Play size={14} />;
    if (act.includes('turn_off')) return <Pause size={14} />;
    if (act.includes('configure') || act.includes('update')) return <Settings size={14} />;
    return <Info size={14} />;
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center justify-between px-2 mb-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-tertiary">
          State Transition Log
        </h3>
        <span className="text-xs font-medium px-2 py-0.5 bg-surface-secondary text-text-secondary rounded-full border border-border-primary">
          {history.length} Event{history.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-3">
        {history.map((record, index) => (
          <div
            key={index}
            className="card card-interactive p-4 flex items-center justify-between group transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-secondary flex items-center justify-center border border-border-primary group-hover:border-primary-500/30 transition-colors">
                {getStatusIcon(record.state_name)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-text-primary capitalize">
                    {record.state_name}
                  </p>
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded bg-surface-secondary text-text-tertiary border border-border-primary">
                    {getActionIcon(record.action_caused)}
                    {record.action_caused}
                  </span>
                </div>
                <p className="text-xs text-text-tertiary mt-0.5">
                  Changed {record.changed_at}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold text-text-secondary">By {record.changed_by}</p>
              <div className="flex justify-end mt-1">
                <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary-500/0 to-primary-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
