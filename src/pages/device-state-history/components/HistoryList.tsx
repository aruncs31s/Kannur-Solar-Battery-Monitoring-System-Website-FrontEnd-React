import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { DeviceStateRecord } from '../hooks/useDeviceStateHistory';

export interface HistoryListProps {
  history: DeviceStateRecord[];
}

export const HistoryList = ({ history }: HistoryListProps) => {
  const getStateVisual = (stateId: number) => {
    switch (stateId) {
      case 1:
        return {
          icon: <CheckCircle className="text-green-600" size={24} />,
          labelClass: 'text-green-600',
        };
      case 2:
        return {
          icon: <XCircle className="text-red-600" size={24} />,
          labelClass: 'text-red-600',
        };
      default:
        return {
          icon: <Clock className="text-blue-600" size={24} />,
          labelClass: 'text-blue-600',
        };
    }
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 dark:text-gray-400">No state history found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((record, index) => (
        <div key={index} className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getStateVisual(record.state).icon}
            <div>
              <p className={`font-semibold ${getStateVisual(record.state).labelClass}`}>{record.stateName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(record.timestamp * 1000).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Action: {record.action} | By: {record.changedBy}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
