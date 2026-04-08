export interface Reading {
  id: string;
  deviceId: string;
  voltage?: number;
  current?: number;
  power?: number;
  avg_voltage?: number;
  avg_current?: number;
  temperature?: number;
  humidity?: number;
  timestamp: number;
}

export interface ReadingAverages {
  voltage: number;
  current: number;
  power: number;
  avg_voltage: number;
  avg_current: number;
}

export interface ProgressiveReadingsResponse {
  readings: Reading[];
  averages: ReadingAverages;
  last_reading_time: string;
}

export interface ReadingFilters {
  deviceId: string;
  startDate?: string;
  endDate?: string;
  interval?: string; // Duration string like "1h", "30m", "15m"
  count?: number; // Number of readings to return
}
