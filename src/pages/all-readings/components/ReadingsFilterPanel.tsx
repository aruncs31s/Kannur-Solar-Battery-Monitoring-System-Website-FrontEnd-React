import { Search, MapPin, Monitor, Calendar, Hash, RefreshCcw } from 'lucide-react';
import { LocationResponseDTO } from '../../../domain/entities/Location';
import { AdvancedReadingFilterDTO } from '../../../domain/entities/Reading';

export interface ReadingsFilterPanelProps {
  locations: LocationResponseDTO[];
  filters: AdvancedReadingFilterDTO;
  onFilterChange: (key: keyof AdvancedReadingFilterDTO, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const ReadingsFilterPanel = ({
  locations,
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters
}: ReadingsFilterPanelProps) => {

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyFilters();
  };

  return (
    <form onSubmit={handleApply} className="card bg-surface-secondary p-6 mb-6 animate-slide-down border-b border-border-primary">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Search size={20} className="text-primary-500" />
          Advanced Filters
        </h2>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-xs font-bold text-primary-500 hover:text-primary-400 flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          <RefreshCcw size={12} />
          Reset Defaults
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
            <MapPin size={14} />
            Location
          </label>
          <select
            value={filters.location_id || ''}
            onChange={(e) => onFilterChange('location_id', e.target.value ? parseInt(e.target.value) : undefined)}
            className="input w-full"
          >
            <option value="">All Locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
            <Monitor size={14} />
            Device IP
          </label>
          <input
            type="text"
            placeholder="e.g. 192.168.1.100"
            value={filters.ip_address || ''}
            onChange={(e) => onFilterChange('ip_address', e.target.value)}
            className="input w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
            <Calendar size={14} />
            From Date
          </label>
          <input
            type="datetime-local"
            value={filters.start_time || ''}
            onChange={(e) => onFilterChange('start_time', e.target.value)}
            className="input w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
            <Calendar size={14} />
            To Date
          </label>
          <input
            type="datetime-local"
            value={filters.end_time || ''}
            onChange={(e) => onFilterChange('end_time', e.target.value)}
            className="input w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-text-tertiary flex items-center gap-2">
            <Hash size={14} />
            Max Readings
          </label>
          <input
            type="number"
            min="1"
            max="5000"
            value={filters.limit || ''}
            onChange={(e) => onFilterChange('limit', e.target.value ? parseInt(e.target.value) : undefined)}
            className="input w-full"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button type="submit" className="btn btn-primary px-8">
          Apply Filters
        </button>
      </div>
    </form>
  );
};
