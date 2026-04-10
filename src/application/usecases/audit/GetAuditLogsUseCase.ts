import { ListWithTotalCount } from '../../types/api';
import { AuditLog, AuditFilter } from '../../../domain/entities/AuditLog';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepository';

export class GetAuditLogsUseCase {
  constructor(private auditRepository: IAuditRepository) {}

  async execute(limit: number, offset: number, filters?: AuditFilter): Promise<ListWithTotalCount<AuditLog>> {
    return await this.auditRepository.getAll(limit, offset, filters);
  }
}
