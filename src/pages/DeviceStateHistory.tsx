import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { History, ArrowLeft, Filter, Calendar, User, Activity } from 'lucide-react';

interface DeviceStateHistoryEntry {
  state_name: string;
  action_caused: string;
  changed_at: string;
  changed_by: string;
}

interface DeviceStateHistoryResponse {
  history: DeviceStateHistoryEntry[];
  total_records: number;
}

export const DeviceStateHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [history, setHistory] = useState<DeviceStateHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deviceName, setDeviceName] = useState('');

  // Filter states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedStates, setSelectedStates] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (id) {
      loadDeviceInfo();
      loadStateHistory();
    }
  }, [id]);

  useEffect(() => {
    loadStateHistory();
  }, [fromDate, toDate, selectedStates]);

  const loadDeviceInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/devices/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error('Failed to load device');

      const data = await response.json();
      setDeviceName(data.device.name);
    } catch (err) {
      console.error('Failed to load device info:', err);
    }
  };

  const loadStateHistory = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      selectedStates.forEach(state => params.append('states', state.toString()));

      const url = `http://localhost:8080/api/devices/${id}/state-history${params.toString() ? '?' + params.toString() : ''}`;

      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
      }

      const data: DeviceStateHistoryResponse = await response.json();
      setHistory(data.history);
      setError('');
    } catch (err) {
      setError('Failed to load device state history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStateColor = (stateName: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-success/10 text-success border-success/20',
      'inactive': 'bg-error/10 text-error border-error/20',
      'maintenance': 'bg-warning/10 text-warning border-warning/20',
      'decommissioned': 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return colors[stateName.toLowerCase()] || 'bg-nord-3 text-nord-10 border-nord-4';
  };

  const getActionIcon = (action: string) => {
    if (action.toLowerCase().includes('turn on') || action.toLowerCase().includes('activated')) {
      return <Activity className="w-4 h-4 text-success" />;
    }
    if (action.toLowerCase().includes('turn off') || action.toLowerCase().includes('deactivated')) {
      return <Activity className="w-4 h-4 text-error" />;
    }
    return <Activity className="w-4 h-4 text-nord-8" />;
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const clearFilters = () => {
    setFromDate('');
    setToDate('');
    setSelectedStates([]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading state history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`/devices/${id}`)}
          className="text-nord-8 hover:text-nord-9 hover:underline mb-4 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Device Details
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <History className="w-8 h-8 text-nord-8" />
              State History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {deviceName && `Device: ${deviceName}`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-nord-8 hover:bg-nord-9 text-white rounded-lg transition-colors"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                States
              </label>
              <select
                multiple
                value={selectedStates.map(s => s.toString())}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                  setSelectedStates(values);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="1">Active</option>
                <option value="2">Inactive</option>
                <option value="3">Maintenance</option>
                <option value="4">Decommissioned</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            State Transitions ({history.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              No state history found for this device.
            </div>
          ) : (
            history.map((entry, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getActionIcon(entry.action_caused)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStateColor(entry.state_name)}`}>
                          {entry.state_name}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">
                          {entry.action_caused}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {formatDateTime(entry.changed_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {entry.changed_by}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};