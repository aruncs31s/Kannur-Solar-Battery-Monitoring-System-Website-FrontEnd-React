import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeviceStateHistory } from './hooks/useDeviceStateHistory';
import { HistoryHeader } from './components/HistoryHeader';
import { HistoryFilters } from './components/HistoryFilters';
import { HistoryList } from './components/HistoryList';
import { StateHistory3D } from './components/StateHistory3D';

export const DeviceStateHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const {
    history,
    loading,
    error,
    deviceName,
    fromDate,
    toDate,
    selectedStates,
    setFromDate,
    setToDate,
    setSelectedStates,
    clearFilters
  } = useDeviceStateHistory(id);

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
      <HistoryHeader
        deviceName={deviceName}
        deviceId={id!}
        showFilters={showFilters}
        onNavigateBack={() => navigate(`/devices/${id}`)}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <HistoryFilters
          fromDate={fromDate}
          toDate={toDate}
          selectedStates={selectedStates}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onStatesChange={setSelectedStates}
          onClearFilters={clearFilters}
        />
      )}

      {/* <StateHistory3D history={history} /> */}

      <HistoryList history={history} />
    </div>
  );
};