import { container } from "../application/di/container";
import { Reading, ReadingFilters } from "../domain/entities/Reading";

export const readingsAPI = {
  getByDevice: async (deviceId: string): Promise<Reading[]> => {
    return await container.getGetDeviceReadingsUseCase().execute(deviceId);
  },

  getByDateRange: async (filters: ReadingFilters): Promise<Reading[]> => {
    return await container.getGetReadingsByDateRangeUseCase().execute(filters);
  },
};
