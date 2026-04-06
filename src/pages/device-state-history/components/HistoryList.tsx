import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { DeviceStateRecord } from '../hooks/useDeviceStateHistory';

export interface HistoryListProps {
  history: DeviceStateRecord[];
}

export const HistoryList = ({ history }: HistoryListProps) => {
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
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            {record.state === 1 ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {record.state === 1 ? 'Active' : 'Inactive'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(record.timestamp * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
