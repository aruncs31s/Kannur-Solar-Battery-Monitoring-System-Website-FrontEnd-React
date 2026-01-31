import { useEffect, useState } from 'react';
import { auditAPI } from '../api/audit';
import { AuditLog } from '../domain/entities/AuditLog';

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await auditAPI.getAll();
      setLogs(data);
    } catch (err) {
      setError('Failed to load audit logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-text-primary">Loading audit logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-100 dark:bg-error-900 text-error-700 dark:text-error-200 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary">Audit Logs</h1>
        <button
          onClick={loadLogs}
          className="px-4 py-2 bg-primary-600 text-text-primary rounded-lg hover:bg-primary-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-surface-primary rounded-lg shadow overflow-hidden border border-border-primary">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-primary">
            <thead className="bg-surface-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-primary divide-y divide-border-primary">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-text-tertiary">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-secondary">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {log.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-primary">
                      {log.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-tertiary">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
