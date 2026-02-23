import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { readingsAPI } from '../api/readings';
import { Reading } from '../domain/entities/Reading';
import ExportPanel from '../components/ExportPanel';

// Calendar View Component
interface CalendarViewProps {
  onDateClick: (dateStr: string) => void;
  datesWithReadings: string[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ onDateClick, datesWithReadings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = new Date(year, month, day).toISOString().split('T')[0];
      days.push({
        day,
        dateStr,
        hasReadings: datesWithReadings.includes(dateStr)
      });
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = getDaysInMonth(currentDate);

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h4 className="text-lg font-semibold text-text-primary">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-surface-secondary rounded-lg transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-text-tertiary">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day ? (
              <button
                onClick={() => onDateClick(day.dateStr)}
                className={`
                  w-full h-full p-2 text-sm rounded-lg transition-colors relative
                  ${day.hasReadings 
                    ? 'bg-primary-500 text-white hover:bg-primary-600' 
                    : 'hover:bg-surface-secondary text-text-primary'
                  }
                `}
              >
                {day.day}
                {day.hasReadings && (
                  <div className="absolute bottom-1 right-1 w-2 h-2 bg-success rounded-full"></div>
                )}
              </button>
            ) : (
              <div className="w-full h-full"></div>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary-500 rounded"></div>
          <span className="text-text-secondary">Has Readings</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-text-secondary">Data Available</span>
        </div>
      </div>
    </div>
  );
};

export const DeviceReadingsHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [deviceName, setDeviceName] = useState('');
  
  // Date filter state
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Last 7 days by default
    return {
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0]
    };
  };
  
  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.start);
  const [endDate, setEndDate] = useState(defaultDates.end);
  const [interval, setInterval] = useState('1h'); // Default 1 hour interval
  const [count, setCount] = useState(100); // Default 100 readings
  
  // Calendar modal state
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarReadings, setCalendarReadings] = useState<Reading[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  useEffect(() => {
    if (id) {
      loadDeviceName();
      loadReadings();
    }
  }, [id, startDate, endDate, interval, count]);

  const loadDeviceName = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/devices/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (response.ok) {
        const data = await response.json();
        setDeviceName(data.device.name);
      }
    } catch (err) {
      console.error('Failed to load device name:', err);
    }
  };

  const loadReadings = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const data = await readingsAPI.getByDateRange({
        deviceId: id,
        startDate: startDate,
        endDate: endDate,
        interval: interval,
        count: count
      });
      
      // Sort by timestamp descending (newest first)
      const sortedReadings = data.sort((a, b) => b.timestamp - a.timestamp);
      setReadings(sortedReadings);
    } catch (err) {
      console.error('Failed to load readings:', err);
    } finally {
      setLoading(false);
    }
  };



  const getStatistics = () => {
    if (readings.length === 0) return { avgVoltage: 0, avgCurrent: 0, avgPower: 0, maxPower: 0, minPower: 0 };
    
    const voltages = readings.map(r => r.voltage ?? 0);
    const currents = readings.map(r => r.current ?? 0);
    const powers = readings.map(r => r.power ?? 0);
    
    return {
      avgVoltage: voltages.reduce((a, b) => a + b, 0) / voltages.length,
      avgCurrent: currents.reduce((a, b) => a + b, 0) / currents.length,
      avgPower: powers.reduce((a, b) => a + b, 0) / powers.length,
      maxPower: Math.max(...powers),
      minPower: Math.min(...powers)
    };
  };

  const stats = getStatistics();

  // Prepare data for history chart
  const getHistoryChartData = () => {
    return readings
      .slice(0, 200) // Limit for performance
      .reverse() // Show oldest to newest
      .map(reading => ({
        time: new Date(reading.timestamp).toLocaleString([], { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        voltage: reading.voltage ?? 0,
        current: reading.current ?? 0,
        power: reading.power ?? 0,
        timestamp: reading.timestamp
      }));
  };

  // Handle calendar date click
  const handleDateClick = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setCalendarLoading(true);
    
    try {
      // Get readings for the selected date
      const selectedDateObj = new Date(dateStr);
      const nextDay = new Date(selectedDateObj);
      nextDay.setDate(nextDay.getDate() + 1);
      
      console.log('Fetching readings for date:', dateStr);
      console.log('Date range:', selectedDateObj.toISOString().split('T')[0], 'to', nextDay.toISOString().split('T')[0]);
      
      const dayReadings = await readingsAPI.getByDateRange({
        deviceId: id!,
        startDate: selectedDateObj.toISOString().split('T')[0],
        endDate: nextDay.toISOString().split('T')[0]
        // Remove interval and count for now to test
      });
      
      console.log('Received readings:', dayReadings);
      setCalendarReadings(dayReadings);
      setShowCalendarModal(true);
    } catch (err) {
      console.error('Failed to load day readings:', err);
    } finally {
      setCalendarLoading(false);
    }
  };

  // Prepare data for calendar day chart
  const getCalendarChartData = () => {
    return calendarReadings
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(reading => ({
        time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        voltage: reading.voltage ?? 0,
        current: reading.current ?? 0,
        power: reading.power ?? 0
      }));
  };

  // Get dates that have readings for calendar highlighting
  const getDatesWithReadings = () => {
    // For now, let's assume readings exist for the last 30 days
    // In a real app, you'd want to fetch this from the API
    const dates = new Set<string>();
    const today = new Date();
    
    // Add dates from current readings
    readings.forEach(reading => {
      const date = new Date(reading.timestamp).toISOString().split('T')[0];
      dates.add(date);
    });
    
    // If no readings in current filter, assume readings exist for last 30 days
    if (dates.size === 0) {
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.add(date.toISOString().split('T')[0]);
      }
    }
    
    return Array.from(dates);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`/devices/${id}`)}
          className="text-primary-500 hover:text-primary-600 hover:underline mb-4"
        >
          ← Back to Device
        </button>
        <h1 className="text-3xl font-bold text-text-primary">Readings History</h1>
        <p className="text-text-secondary mt-2">{deviceName}</p>
      </div>

      {/* Date Filter */}
      <div className="bg-surface-primary rounded-lg shadow p-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="text-primary-500" size={20} />
            <span className="text-sm font-medium text-text-primary">Filter by Date Range:</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Interval:</label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value="15m">15 minutes</option>
              <option value="30m">30 minutes</option>
              <option value="1h">1 hour</option>
              <option value="2h">2 hours</option>
              <option value="4h">4 hours</option>
              <option value="6h">6 hours</option>
              <option value="12h">12 hours</option>
              <option value="1d">1 day</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-text-secondary">Max Readings:</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              const dates = getDefaultDates();
              setStartDate(dates.start);
              setEndDate(dates.end);
            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-text-primary rounded-lg text-sm font-medium transition-colors"
          >
            Last 7 Days
          </button>
          
          <button
            onClick={() => {
              const endDate = new Date();
              const startDate = new Date();
              startDate.setDate(startDate.getDate() - 30);
              setStartDate(startDate.toISOString().split('T')[0]);
              setEndDate(endDate.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-text-primary rounded-lg text-sm font-medium transition-colors"
          >
            Last 30 Days
          </button>

          <ExportPanel
            data={readings}
            defaultFilename={`${deviceName || 'device'}-readings-${startDate}-to-${endDate}`}
            disabled={readings.length === 0}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      {readings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-surface-primary border border-border-primary rounded-lg p-4">
            <p className="text-xs text-text-tertiary">Total Readings</p>
            <p className="text-2xl font-bold text-text-primary mt-1">{readings.length}</p>
          </div>
          <div className="bg-surface-primary border border-border-primary rounded-lg p-4">
            <p className="text-xs text-text-tertiary">Avg Voltage</p>
            <p className="text-2xl font-bold text-primary-500 mt-1">{stats.avgVoltage.toFixed(2)}V</p>
          </div>
          <div className="bg-surface-primary border border-border-primary rounded-lg p-4">
            <p className="text-xs text-text-tertiary">Avg Current</p>
            <p className="text-2xl font-bold text-success mt-1">{stats.avgCurrent.toFixed(2)}A</p>
          </div>
          <div className="bg-surface-primary border border-border-primary rounded-lg p-4">
            <p className="text-xs text-text-tertiary">Avg Power</p>
            <p className="text-2xl font-bold text-warning mt-1">{stats.avgPower.toFixed(2)}W</p>
          </div>
          <div className="bg-surface-primary border border-border-primary rounded-lg p-4">
            <p className="text-xs text-text-tertiary">Peak Power</p>
            <p className="text-2xl font-bold text-error mt-1">{stats.maxPower.toFixed(2)}W</p>
          </div>
        </div>
      )}

      {/* History Chart */}
      {readings.length > 0 && (
        <div className="bg-surface-primary rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Readings Overview</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getHistoryChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                <XAxis 
                  dataKey="time" 
                  stroke="var(--text-secondary)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--text-secondary)"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--surface-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="voltage" 
                  stackId="1" 
                  stroke="var(--primary-500)" 
                  fill="var(--primary-500)" 
                  fillOpacity={0.3}
                  name="Voltage (V)"
                />
                <Area 
                  type="monotone" 
                  dataKey="current" 
                  stackId="2" 
                  stroke="var(--success)" 
                  fill="var(--success)" 
                  fillOpacity={0.3}
                  name="Current (A)"
                />
                <Area 
                  type="monotone" 
                  dataKey="power" 
                  stackId="3" 
                  stroke="var(--warning)" 
                  fill="var(--warning)" 
                  fillOpacity={0.3}
                  name="Power (W)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Calendar View */}
      <div className="bg-surface-primary rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Calendar View</h2>
          <button
            onClick={() => setShowCalendarModal(true)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Calendar size={16} />
            Open Calendar
          </button>
        </div>
        <p className="text-sm text-text-secondary">
          Click on dates in the calendar to view detailed graphs for that day.
        </p>
      </div>

      {/* Readings Table */}
      <div className="bg-surface-primary rounded-lg shadow">
        <div className="p-6 border-b border-border-primary">
          <h2 className="text-xl font-semibold text-text-primary">
            Readings from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Showing {readings.length} readings
          </p>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-text-secondary">Loading readings...</div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border-primary">
              <thead className="bg-surface-secondary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                    Voltage (V)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                    Current (A)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                    Power (W)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-surface-primary divide-y divide-border-primary">
                {readings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">
                      No readings found for the selected date range
                    </td>
                  </tr>
                ) : (
                  readings.map((reading) => (
                    <tr key={reading.id} className="hover:bg-surface-secondary transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {new Date(reading.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-500">
                        {(reading.voltage ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-success">
                        {(reading.current ?? 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-warning">
                        {(reading.power ?? 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface-primary rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border-primary">
              <h3 className="text-xl font-semibold text-text-primary">
                {selectedDate ? `Readings for ${new Date(selectedDate).toLocaleDateString()}` : 'Select a Date'}
              </h3>
              <button
                onClick={() => {
                  setShowCalendarModal(false);
                  setSelectedDate(null);
                  setCalendarReadings([]);
                }}
                className="text-text-secondary hover:text-text-primary"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {!selectedDate ? (
                <CalendarView 
                  onDateClick={handleDateClick} 
                  datesWithReadings={getDatesWithReadings()}
                />
              ) : calendarLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="text-lg text-text-secondary">Loading readings...</div>
                </div>
              ) : calendarReadings.length > 0 ? (
                <div>
                  <div className="h-80 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getCalendarChartData()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                        <XAxis 
                          dataKey="time" 
                          stroke="var(--text-secondary)"
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="var(--text-secondary)"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'var(--surface-primary)',
                            border: '1px solid var(--border-primary)',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="voltage" 
                          stroke="var(--primary-500)" 
                          strokeWidth={2}
                          name="Voltage (V)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="current" 
                          stroke="var(--success)" 
                          strokeWidth={2}
                          name="Current (A)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="power" 
                          stroke="var(--warning)" 
                          strokeWidth={2}
                          name="Power (W)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-surface-secondary rounded-lg p-4">
                      <p className="text-sm text-text-tertiary">Avg Voltage</p>
                      <p className="text-xl font-bold text-primary-500">
                        {(calendarReadings.reduce((sum, r) => sum + (r.voltage ?? 0), 0) / calendarReadings.length).toFixed(2)}V
                      </p>
                    </div>
                    <div className="bg-surface-secondary rounded-lg p-4">
                      <p className="text-sm text-text-tertiary">Avg Current</p>
                      <p className="text-xl font-bold text-success">
                        {(calendarReadings.reduce((sum, r) => sum + (r.current ?? 0), 0) / calendarReadings.length).toFixed(2)}A
                      </p>
                    </div>
                    <div className="bg-surface-secondary rounded-lg p-4">
                      <p className="text-sm text-text-tertiary">Avg Power</p>
                      <p className="text-xl font-bold text-warning">
                        {(calendarReadings.reduce((sum, r) => sum + (r.power ?? 0), 0) / calendarReadings.length).toFixed(2)}W
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">No readings available for this date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
