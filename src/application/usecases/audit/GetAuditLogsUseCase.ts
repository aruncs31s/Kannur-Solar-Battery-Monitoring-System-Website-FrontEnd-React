import { AuditLog } from '../../../domain/entities/AuditLog';
import { IAuditRepository } from '../../../domain/repositories/IAuditRepository';

export class GetAuditLogsUseCase {
  constructor(private auditRepository: IAuditRepository) {}

  async execute(): Promise<AuditLog[]> {
    return await this.auditRepository.getAll();
  }
}
