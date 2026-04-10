import { IAuditRepository } from '../../domain/repositories/IAuditRepository';
import { AuditLog, AuditFilter } from '../../domain/entities/AuditLog';
import { httpClient } from '../http/HttpClient';
import { ListWithTotalCount } from '../../application/types/api';

export class AuditRepository implements IAuditRepository {
  async getAll(limit: number, offset: number, filters?: AuditFilter): Promise<ListWithTotalCount<AuditLog>> {
    let url = `/audit?limit=${limit}&offset=${offset}`;
    if (filters) {
      if (filters.action) url += `&action=${encodeURIComponent(filters.action)}`;
      if (filters.username) url += `&username=${encodeURIComponent(filters.username)}`;
      if (filters.ipAddress) url += `&ip_address=${encodeURIComponent(filters.ipAddress)}`;
      if (filters.startDate) url += `&start_date=${encodeURIComponent(filters.startDate)}`;
      if (filters.endDate) url += `&end_date=${encodeURIComponent(filters.endDate)}`;
    }
    const response = await httpClient.get<{ list: any[], total_count: number }>(url);
    return {
      total_count: response.total_count,
      list: response.list.map(dto => ({
        id: dto.id.toString(),
        userId: dto.user_id.toString(),
        username: dto.username,
        action: dto.action,
        details: dto.details,
        ipAddress: dto.ip_address,
        timestamp: new Date(dto.created_at).getTime(),
      }))
    };
  }
}
