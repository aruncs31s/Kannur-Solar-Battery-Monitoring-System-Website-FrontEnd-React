import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  useDateFilter: boolean;
  startDate: string;
  endDate: string;
  onUseDateFilterChange: (checked: boolean) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSetLast7Days: () => void;
  onSetLast30Days: () => void;
}

export const DateRangeFilter = ({
  useDateFilter,
  startDate,
  endDate,
  onUseDateFilterChange,
  onStartDateChange,
  onEndDateChange,
  onSetLast7Days,
  onSetLast30Days,
}: DateRangeFilterProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary-500" size={20} />
          <span className="text-sm font-medium text-gray-900 dark:text-white">Date Range:</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="useDateFilter"
            checked={useDateFilter}
            onChange={(e) => onUseDateFilterChange(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="useDateFilter" className="text-sm text-gray-700 dark:text-gray-300">
            Enable Date Filter
          </label>
        </div>

        {useDateFilter && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">From:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">To:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
            </div>

            <button
              onClick={onSetLast7Days}
              className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Last 7 Days
            </button>

            <button
              onClick={onSetLast30Days}
              className="px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Last 30 Days
            </button>
          </>
        )}
      </div>
    </div>
  );
};