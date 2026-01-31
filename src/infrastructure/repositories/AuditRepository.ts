import { IAuditRepository } from '../../domain/repositories/IAuditRepository';
import { AuditLog } from '../../domain/entities/AuditLog';
import { httpClient } from '../http/HttpClient';

export class AuditRepository implements IAuditRepository {
  async getAll(): Promise<AuditLog[]> {
    const response = await httpClient.get<{ logs: any[] }>('/audit');
    return response.logs.map(dto => ({
      id: dto.id.toString(),
      userId: dto.user_id.toString(),
      username: dto.username,
      action: dto.action,
      details: dto.details,
      ipAddress: dto.ip_address,
      timestamp: new Date(dto.created_at).getTime(),
    }));
  }
}
