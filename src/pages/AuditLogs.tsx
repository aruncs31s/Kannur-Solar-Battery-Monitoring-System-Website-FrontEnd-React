import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { auditAPI } from '../api/audit';
import { AuditLog } from '../domain/entities/AuditLog';
import { LoadingState, PageHeader, DataTable, FormError, ActionButton } from '../components';

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
      setError(null);
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
    return <LoadingState message="Loading audit logs..." />;
  }

  const columns = [
    {
      header: 'Timestamp',
      accessor: (log: AuditLog) => formatDate(log.timestamp),
      className: 'whitespace-nowrap',
    },
    {
      header: 'User',
      accessor: 'username',
      className: 'whitespace-nowrap',
    },
    {
      header: 'Action',
      accessor: (log: AuditLog) => (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
          {log.action}
        </span>
      ),
      className: 'whitespace-nowrap',
    },
    {
      header: 'Details',
      accessor: 'details',
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      className: 'whitespace-nowrap',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="View system activity and user actions"
      >
        <ActionButton
          label="Refresh"
          icon={RefreshCw}
          variant="primary"
          onClick={loadLogs}
        />
      </PageHeader>

      {error && <FormError message={error} />}

      <DataTable
        columns={columns}
        data={logs}
        emptyMessage="No audit logs found"
      />
    </div>
  );
}
