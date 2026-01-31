export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  details: string;
  ipAddress: string;
  timestamp: number;
}
