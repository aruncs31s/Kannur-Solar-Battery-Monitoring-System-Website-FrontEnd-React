export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: number;
}

export interface AuditFilter {
  action?: string;
  username?: string;
  ipAddress?: string;
  startDate?: string;
  endDate?: string;
}
