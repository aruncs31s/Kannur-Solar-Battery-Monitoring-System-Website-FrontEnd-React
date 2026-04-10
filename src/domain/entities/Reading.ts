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

export interface ReadingResponseDTO {
  id: number;
  device_id: number;
  voltage: number;
  current: number;
  power: number;
  avg_voltage: number;
  avg_current: number;
  created_at: string;
}

export interface ProgressiveReadingsDTO {
  readings: ReadingResponseDTO[];
  averages: ReadingAverages;
  last_reading_time: string;
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

export interface AdvancedReadingFilterDTO {
  location_id?: number;
  ip_address?: string;
  start_time?: string; // ISO 8601
  end_time?: string; // ISO 8601
  limit?: number;
  interval?: string;
}

export interface AdvancedReadingViewDTO {
  id: string;
  device_id: number;
  device_name: string;
  voltage: number;
  current: number;
  power: number;
  timestamp: string; // From backend created_at as string
}

export interface AdvancedReadingViewResponseDTO {
  readings: AdvancedReadingViewDTO[];
  total: number;
}
