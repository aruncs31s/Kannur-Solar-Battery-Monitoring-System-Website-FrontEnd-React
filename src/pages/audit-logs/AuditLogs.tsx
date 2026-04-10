import { useEffect, useState } from 'react';
import { RefreshCw, Filter, X } from 'lucide-react';
import { auditAPI } from '../../api/audit';
import { AuditLog, AuditFilter } from '../../domain/entities/AuditLog';
import { PageHeader, DataTable, FormError, ActionButton, Pagination } from '../../components';

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<AuditFilter>({});
  const pageSize = 10;

  useEffect(() => {
    loadLogs(currentPage, filters);
  }, [currentPage]);

  const loadLogs = async (page: number = 1, appliedFilters: AuditFilter = filters) => {
    try {
      setLoading(true);
      const offset = (page - 1) * pageSize;
      const data = await auditAPI.getAll(pageSize, offset, appliedFilters);
      setLogs(data.list);
      setTotalCount(data.total_count);
      setError(null);
    } catch (err) {
      setError('Failed to load audit logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (currentPage === 1) {
      loadLogs(1);
    } else {
      setCurrentPage(1);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

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
        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-primary-500/10 text-primary-500 dark:bg-primary-500/20">
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
      className: 'whitespace-nowrap text-text-tertiary font-mono text-xs',
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
          onClick={handleRefresh}
          loading={loading}
        />
      </PageHeader>

      <div className="bg-surface-primary p-4 rounded-xl shadow-xl border border-border-primary flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">Action</label>
          <select
            className="w-full bg-surface-secondary text-text-primary rounded-lg border border-border-primary px-3 py-2"
            value={filters.action || ''}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          >
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="device_add">Device Add</option>
            <option value="device_update">Device Update</option>
            <option value="device_delete">Device Delete</option>
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">Username</label>
          <input
            type="text"
            className="w-full bg-surface-secondary text-text-primary rounded-lg border border-border-primary px-3 py-2"
            placeholder="Search username"
            value={filters.username || ''}
            onChange={(e) => setFilters({ ...filters, username: e.target.value })}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">IP Address</label>
          <input
            type="text"
            className="w-full bg-surface-secondary text-text-primary rounded-lg border border-border-primary px-3 py-2"
            placeholder="Search IP"
            value={filters.ipAddress || ''}
            onChange={(e) => setFilters({ ...filters, ipAddress: e.target.value })}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">Start Date</label>
          <input
            type="date"
            className="w-full bg-surface-secondary text-text-primary rounded-lg border border-border-primary px-3 py-2"
            value={filters.startDate || ''}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">End Date</label>
          <input
            type="date"
            className="w-full bg-surface-secondary text-text-primary rounded-lg border border-border-primary px-3 py-2"
            value={filters.endDate || ''}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
           <button
            onClick={() => {
              setCurrentPage(1);
              loadLogs(1, filters);
            }}
            className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Filter size={18} />
            Apply
          </button>
          <button
            onClick={() => {
              const empty = {};
              setFilters(empty);
              setCurrentPage(1);
              loadLogs(1, empty);
            }}
            className="flex items-center gap-2 bg-surface-tertiary text-text-secondary px-4 py-2 rounded-lg hover:bg-surface-elevated hover:text-text-primary transition-colors"
          >
            <X size={18} />
            Clear
          </button>
        </div>
      </div>

      {error && <FormError message={error} />}

      <div className="bg-surface-primary rounded-xl shadow-xl border border-border-primary overflow-hidden">
        <DataTable
          columns={columns}
          data={logs}
          emptyMessage="No audit logs found"
          loading={loading}
        />
        
        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          loading={loading}
        />
      </div>
    </div>
  );
}
