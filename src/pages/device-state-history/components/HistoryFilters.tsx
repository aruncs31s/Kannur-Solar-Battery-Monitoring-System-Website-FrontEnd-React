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
  const stateOptions = [
    { id: 1, label: 'Active' },
    { id: 2, label: 'Inactive' },
    { id: 3, label: 'Maintenance' },
    { id: 4, label: 'Decommissioned' },
    { id: 5, label: 'Initialized' },
  ];

  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Filters
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            From Date
          </label>
          <input
            type="datetime-local"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            To Date
          </label>
          <input
            type="datetime-local"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Device States
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {stateOptions.map((state) => (
            <label key={state.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedStates.includes(state.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onStatesChange([...selectedStates, state.id]);
                  } else {
                    onStatesChange(selectedStates.filter((s) => s !== state.id));
                  }
                }}
                className="w-4 h-4"
              />
              <span className="text-gray-700 dark:text-gray-300">
                {state.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={onClearFilters}
        className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
};
