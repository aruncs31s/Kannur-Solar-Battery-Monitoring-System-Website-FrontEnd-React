export interface Reading {
  id: string;
  deviceId: string;
  voltage?: number;
  current?: number;
  power?: number;
  temperature?: number;
  humidity?: number;
  timestamp: number;
}

export interface ReadingFilters {
  deviceId: string;
  startDate?: string;
  endDate?: string;
}
