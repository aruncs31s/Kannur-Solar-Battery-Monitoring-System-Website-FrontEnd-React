import { ArrowLeft, Filter } from 'lucide-react';

export interface HistoryHeaderProps {
  deviceName: string;
  deviceId: string;
  showFilters: boolean;
  onNavigateBack: () => void;
  onToggleFilters: () => void;
}

export const HistoryHeader = ({
  deviceName,
  onNavigateBack,
  onToggleFilters,
}: HistoryHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onNavigateBack}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            State History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{deviceName}</p>
        </div>
      </div>
      <button
        onClick={onToggleFilters}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Filter size={20} />
        Filters
      </button>
    </div>
  );
};
