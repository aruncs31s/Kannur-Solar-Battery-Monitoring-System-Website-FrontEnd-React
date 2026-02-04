import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface DeviceSearchResult {
  id: number;
  name: string;
}

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  expandable?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  results?: DeviceSearchResult[];
}

export const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className = "", 
  expandable = false,
  isExpanded = true,
  onToggleExpand,
  results = []
}: SearchBarProps) => {
  if (expandable && !isExpanded) {
    return (
      <button
        onClick={onToggleExpand}
        className={`p-2 rounded-xl bg-surface-secondary text-text-secondary hover:bg-surface-tertiary transition-all ${className}`}
        aria-label="Open search"
      >
        <Search size={18} />
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={18} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-10 py-2 rounded-xl bg-surface-secondary border border-border-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-text-primary placeholder-text-tertiary transition-all"
      />
      {expandable && (
        <button
          onClick={onToggleExpand}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
          aria-label="Close search"
        >
          <X size={18} />
        </button>
      )}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface-primary border border-border-primary rounded-xl shadow-lg max-h-64 overflow-y-auto z-50"
          >
            {results.map((result) => (
              <Link
                key={result.id}
                to={`/devices/${result.id}`}
                className="block px-4 py-3 text-sm text-text-primary hover:bg-surface-secondary transition-colors border-b border-border-primary last:border-b-0"
              >
                <div className="font-medium">{result.name}</div>
                <div className="text-xs text-text-tertiary">Device #{result.id}</div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};