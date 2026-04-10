import { ListWithTotalCount } from '../../application/types/api';
import { AuditLog, AuditFilter } from '../entities/AuditLog';

export interface IAuditRepository {
  getAll(limit: number, offset: number, filters?: AuditFilter): Promise<ListWithTotalCount<AuditLog>>;
}
