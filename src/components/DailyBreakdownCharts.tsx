import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Reading } from '../domain/entities/Reading';

interface DailyBreakdownChartsProps {
  allReadings: Reading[];
  selectedDay: string | null;
  onDaySelect: (date: string) => void;
}

interface DailyData {
  date: string;
  readings: Reading[];
  chartData: Array<{
    time: string;
    voltage: number;
    current: number;
    power: number;
  }>;
  avgVoltage: number;
  avgCurrent: number;
  avgPower: number;
  count: number;
}

export const DailyBreakdownCharts = ({
  allReadings,
  selectedDay,
  onDaySelect
}: DailyBreakdownChartsProps) => {
  // Group readings by day for breakdown charts
  const getDailyBreakdown = (): DailyData[] => {
    const dailyData: { [key: string]: Reading[] } = {};

    // Use allReadings (last 7 days) for breakdown
    allReadings.forEach(reading => {
      const date = new Date(reading.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(reading);
    });

    // Generate all 7 days, even if no data
    const result: DailyData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const readings = dailyData[dateString] || [];
      result.push({
        date: dateString,
        readings: readings.sort((a, b) => a.timestamp - b.timestamp),
        chartData: readings
          .sort((a, b) => a.timestamp - b.timestamp)
          .map(r => ({
            time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            voltage: r.voltage ?? 0,
            current: r.current ?? 0,
            power: r.power ?? 0
          })),
        avgVoltage: readings.length > 0 ? readings.reduce((sum, r) => sum + (r.voltage ?? 0), 0) / readings.length : 0,
        avgCurrent: readings.length > 0 ? readings.reduce((sum, r) => sum + (r.current ?? 0), 0) / readings.length : 0,
        avgPower: readings.length > 0 ? readings.reduce((sum, r) => sum + (r.power ?? 0), 0) / readings.length : 0,
        count: readings.length
      });
    }

    return result;
  };

  if (allReadings.length === 0 || selectedDay) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Breakdown (Last 7 Days)</h2>
      <p className="text-gray-600 dark:text-gray-400">Click on any day to zoom into detailed view</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {getDailyBreakdown().map((day) => (
          <div
            key={day.date}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => onDaySelect(day.date)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{day.date}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{day.count} readings</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">Avg: {day.avgVoltage.toFixed(1)}V</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{day.avgCurrent.toFixed(2)}A</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{day.avgPower.toFixed(1)}W</p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Click to zoom</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={day.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
                <XAxis
                  dataKey="time"
                  stroke="var(--text-tertiary)"
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                />
                <YAxis
                  stroke="var(--text-tertiary)"
                  tick={{ fill: 'var(--text-tertiary)', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface-primary)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgb(0 0 0 / 0.1)',
                    color: 'var(--text-primary)',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="voltage"
                  stroke="#5E81AC"
                  strokeWidth={2}
                  dot={false}
                  name="V"
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#A3BE8C"
                  strokeWidth={2}
                  dot={false}
                  name="A"
                />
                <Line
                  type="monotone"
                  dataKey="power"
                  stroke="#B48EAD"
                  strokeWidth={2}
                  dot={false}
                  name="W"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
};
