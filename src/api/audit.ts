import { ListWithTotalCount } from "../application/types/api";
import { container } from "../application/di/container";
import { AuditLog, AuditFilter } from "../domain/entities/AuditLog";

export const auditAPI = {
  getAll: async (limit: number, offset: number, filters?: AuditFilter): Promise<ListWithTotalCount<AuditLog>> => {
    return await container.getGetAuditLogsUseCase().execute(limit, offset, filters);
  },
};
