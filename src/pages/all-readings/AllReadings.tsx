import { Link } from 'react-router-dom';
import { RefreshCw, Activity } from 'lucide-react';
import ExportPanel from '../../components/ExportPanel';
import { useAdvancedReadings } from './hooks/useAdvancedReadings';
import { ReadingsFilterPanel } from './components/ReadingsFilterPanel';

export const AllReadings = () => {
  const {
    readings,
    total,
    loading,
    error,
    locations,
    filters,
    handleFilterChange,
    applyFilters,
    clearFilters,
    refreshReadings
  } = useAdvancedReadings();

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">System Readings</h1>
          <p className="text-text-tertiary mt-2 text-sm max-w-2xl">
            Explore and filter telemetry data across all locations and devices in the system.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refreshReadings}
            disabled={loading}
            className="btn bg-surface-secondary text-text-primary border-border-primary hover:bg-surface-tertiary transition-all duration-300 shadow-sm flex items-center gap-2 px-4 py-2 rounded-xl font-bold"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <ExportPanel
            data={readings}
            defaultFilename="advanced-readings-export"
            disabled={readings.length === 0}
          />
        </div>
      </div>

      <ReadingsFilterPanel 
        locations={locations}
        filters={filters}
        onFilterChange={handleFilterChange}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
      />

      {error && (
        <div className="bg-error-500/10 border border-error-500 text-error-500 p-4 rounded-xl flex items-center gap-3 shadow-sm mb-6 animate-fade-in">
          <Activity size={20} />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {/* Summary Stats */}
      {readings.length > 0 && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="card bg-surface-secondary p-4 flex flex-col justify-between border-b-2 border-b-primary-500/30">
             <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Total Results</p>
             <p className="text-2xl font-black text-primary-500 mt-1">{total}</p>
          </div>
          <div className="card bg-surface-secondary p-4 flex flex-col justify-between border-b-2 border-b-text-secondary/30">
             <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Shown in Table</p>
             <p className="text-2xl font-black text-text-primary mt-1">{readings.length}</p>
          </div>
          <div className="card bg-surface-secondary p-4 flex flex-col justify-between border-b-2 border-b-warning-500/30">
             <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Avg Voltage</p>
             <p className="text-2xl font-black text-warning-500 mt-1">
               {(readings.reduce((sum, r) => sum + r.voltage, 0) / readings.length).toFixed(2)}V
             </p>
          </div>
          <div className="card bg-surface-secondary p-4 flex flex-col justify-between border-b-2 border-b-success-500/30">
             <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Avg Current</p>
             <p className="text-2xl font-black text-success-500 mt-1">
               {(readings.reduce((sum, r) => sum + r.current, 0) / readings.length).toFixed(2)}A
             </p>
          </div>
          <div className="card bg-surface-secondary p-4 flex flex-col justify-between border-b-2 border-b-primary-400/30">
             <p className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">Avg Power</p>
             <p className="text-2xl font-black text-primary-400 mt-1">
               {(readings.reduce((sum, r) => sum + r.power, 0) / readings.length).toFixed(2)}W
             </p>
          </div>
        </div>
      )}

      <div className="card overflow-hidden border border-border-primary rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-secondary border-b border-border-primary">
                <th className="px-5 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">
                  Device
                </th>
                <th className="px-5 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">
                  Timestamp
                </th>
                <th className="px-5 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">
                  Voltage (V)
                </th>
                <th className="px-5 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">
                  Current (A)
                </th>
                <th className="px-5 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest leading-none">
                  Power (W)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-primary bg-surface-primary">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-text-tertiary">
                    <RefreshCw className="animate-spin mx-auto mb-3" size={24} />
                    Loading powerful telemetry...
                  </td>
                </tr>
              ) : readings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-text-tertiary">
                    No readings found matching criteria.
                  </td>
                </tr>
              ) : (
                readings.map((reading) => (
                  <tr key={reading.id} className="hover:bg-surface-secondary/50 transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/devices/${reading.device_id}`}
                        className="text-primary-500 hover:text-primary-400 hover:underline font-bold transition-all"
                      >
                        {reading.device_name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs font-semibold text-text-secondary">
                      {new Date(reading.timestamp).toLocaleString(undefined, { 
                         month: 'short', day: 'numeric', 
                         hour: '2-digit', minute: '2-digit', second: '2-digit' 
                      })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-warning-600 dark:text-warning-500">
                      {reading.voltage.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-success-600 dark:text-success-500">
                      {reading.current.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm font-bold text-primary-600 dark:text-primary-400">
                      {reading.power.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

