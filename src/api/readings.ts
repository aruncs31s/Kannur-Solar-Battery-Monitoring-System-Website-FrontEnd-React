import { container } from "../application/di/container";
import { Reading, ReadingFilters, ProgressiveReadingsResponse } from "../domain/entities/Reading";

export const readingsAPI = {
  getByDevice: async (deviceId: string | number, limit?: number): Promise<Reading[]> => {
    return await container.getGetDeviceReadingsUseCase().execute(deviceId.toString(), limit);
  },

  getProgressiveByDevice: async (deviceId: number): Promise<ProgressiveReadingsResponse> => {
    return await container.getGetProgressiveReadingsUseCase().execute(deviceId);
  },

  getByDateRange: async (filters: ReadingFilters): Promise<Reading[]> => {
    return await container.getGetReadingsByDateRangeUseCase().execute(filters);
  },

  getSevenDaysByLocation: async (locationId: number): Promise<Reading[]> => {
    return await container.getGetSevenDaysReadingsByLocationUseCase().execute(locationId);
  },
};
