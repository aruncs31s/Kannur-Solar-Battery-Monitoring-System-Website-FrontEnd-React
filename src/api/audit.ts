import { container } from "../application/di/container";
import { AuditLog } from "../domain/entities/AuditLog";

export const auditAPI = {
  getAll: async (): Promise<AuditLog[]> => {
    return await container.getGetAuditLogsUseCase().execute();
  },
};
