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
    <div className="bg-surface-primary rounded-xl shadow-xl border border-border-primary overflow-hidden">
      <div className="p-6 border-b border-border-primary flex justify-between items-center bg-surface-primary/50 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-text-primary tracking-tight">
          {useDateFilter ? `Readings (${startDate} to ${endDate})` : 'Recent Readings'}
        </h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-text-muted flex items-center gap-2">
            SHOW LIMIT:
            <select
              value={readingsLimit}
              onChange={(e) => onReadingsLimitChange(Number(e.target.value))}
              className="px-3 py-1.5 border border-border-primary rounded-lg bg-surface-secondary text-text-primary font-bold text-xs focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            >
              {[10, 20, 50, 100, 500].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border-primary">
          <thead className="bg-surface-secondary">
            <tr>
              {['Timestamp', 'Voltage (V)', 'Current (A)', 'Power (W)'].map((header) => (
                <th key={header} className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  {header}
                </th>
              ))}
              {readings.some(r => r.temperature) && (
                <th className="px-6 py-4 text-left text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Temperature (°C)
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-secondary">
            {readings.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-text-tertiary italic font-medium">
                  No readings detected in registry
                </td>
              </tr>
            ) : (
              readings.map((reading) => (
                <tr key={reading.id} className="hover:bg-surface-hover/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                    {new Date(reading.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-nord-8">
                    {(reading.voltage ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-success">
                    {(reading.current ?? 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-nord-15">
                    {(reading.power ?? 0).toFixed(2)}
                  </td>
                  {reading.temperature && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-warning">
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