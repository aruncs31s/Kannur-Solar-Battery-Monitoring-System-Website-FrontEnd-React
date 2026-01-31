import { AuditLog } from '../entities/AuditLog';

export interface IAuditRepository {
  getAll(): Promise<AuditLog[]>;
}
