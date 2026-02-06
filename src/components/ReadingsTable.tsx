import { Reading } from '../domain/entities/Reading';

interface ReadingsTableProps {
  readings: Reading[];
  useDateFilter: boolean;
  startDate: string;
  endDate: string;
  readingsLimit: number;
  onReadingsLimitChange: (limit: number) => void;
}

export const ReadingsTable = ({
  readings,
  useDateFilter,
  startDate,
  endDate,
  readingsLimit,
  onReadingsLimitChange,
}: ReadingsTableProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {useDateFilter ? `Readings (${startDate} to ${endDate})` : 'Recent Readings'}
        </h2>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            Show:
            <select
              value={readingsLimit}
              onChange={(e) => onReadingsLimitChange(Number(e.target.value))}
              className="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
            </select>
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Voltage (V)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Current (A)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Power (W)
              </th>
              {readings.some(r => r.temperature) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Temperature (°C)
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {readings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No readings available
                </td>
              </tr>
            ) : (
              readings.map((reading) => (
                <tr key={reading.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(reading.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-nord-8">
                    {(reading.voltage ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                    {(reading.current ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-nord-15">
                    {(reading.power ?? 0).toFixed(2)}
                  </td>
                  {reading.temperature && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600 dark:text-orange-400">
                      {reading.temperature.toFixed(1)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};