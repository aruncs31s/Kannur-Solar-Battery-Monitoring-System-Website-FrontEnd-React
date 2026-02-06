import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { devicesAPI } from '../api/devices';
import { MicrocontrollerDTO } from '../domain/entities/Device';
import { DataTable } from '../components/DataTable';
import {
  ArrowLeft,
  Activity,
  Cpu,
  Wifi,
  HardDrive,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

export const AdminESPDeviceManagement = () => {
  const [microcontrollers, setMicrocontrollers] = useState<MicrocontrollerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    inUse: 0,
  });

  useEffect(() => {
    fetchMicrocontrollers();
  }, []);

  const fetchMicrocontrollers = async () => {
    setLoading(true);
    setError('');
    try {
      const data: MicrocontrollerDTO[] = await devicesAPI.getMicrocontrollers();
      setMicrocontrollers(data);

      // Calculate statistics
      const active = data.filter((mc: MicrocontrollerDTO) => mc.status.toLowerCase() === 'active').length;
      const inUse = data.filter((mc: MicrocontrollerDTO) => mc.used_by && mc.used_by.trim() !== '').length;

      setStats({
        total: data.length,
        active: active,
        inactive: data.length - active,
        inUse: inUse,
      });
    } catch (err) {
      setError('Failed to fetch ESP devices. Please try again.');
      console.error('Error fetching microcontrollers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'active') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
          Active
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-500 border border-gray-500/20">
        {status}
      </span>
    );
  };

  const columns = [
    {
      header: 'ID',
      accessor: (row: MicrocontrollerDTO) => (
        <Link
          to={`/devices/mc/${row.id}`}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          #{row.id}
        </Link>
      ),
    },
    {
      header: 'Name',
      accessor: (row: MicrocontrollerDTO) => (
        <div className="font-medium text-text-primary">{row.name}</div>
      ),
    },
    {
      header: 'IP Address',
      accessor: (row: MicrocontrollerDTO) => (
        <div className="flex items-center gap-2 text-text-secondary">
          <Wifi size={14} />
          <span>{row.ip_address || '—'}</span>
        </div>
      ),
    },
    {
      header: 'MAC Address',
      accessor: (row: MicrocontrollerDTO) => (
        <div className="text-text-secondary font-mono text-sm">
          {row.mac_address || '—'}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row: MicrocontrollerDTO) => getStatusBadge(row.status),
    },
    {
      header: 'Used By',
      accessor: (row: MicrocontrollerDTO) => (
        <div className="text-text-secondary">
          {row.used_by && row.used_by.trim() !== '' ? row.used_by : (
            <span className="text-text-tertiary italic">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      header: 'Parent ID',
      accessor: (row: MicrocontrollerDTO) => (
        <div className="text-text-secondary">
          {row.parent_id && row.parent_id !== 0 ? `#${row.parent_id}` : '—'}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-text-primary">ESP Device Management</h1>
          <p className="text-text-secondary mt-2">Monitor and manage ESP microcontrollers</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={fetchMicrocontrollers}
            disabled={loading}
            className="bg-primary hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <div>
            <p className="text-red-500 font-medium">Error</p>
            <p className="text-red-400 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Total Devices</p>
              <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
            </div>
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl">
              <Cpu size={28} />
            </div>
          </div>
        </div>

        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Active</p>
              <p className="text-3xl font-bold text-green-500">{stats.active}</p>
            </div>
            <div className="bg-green-500/10 text-green-500 p-3 rounded-xl">
              <Activity size={28} />
            </div>
          </div>
        </div>

        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Inactive</p>
              <p className="text-3xl font-bold text-yellow-500">{stats.inactive}</p>
            </div>
            <div className="bg-yellow-500/10 text-yellow-500 p-3 rounded-xl">
              <AlertCircle size={28} />
            </div>
          </div>
        </div>

        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">In Use</p>
              <p className="text-3xl font-bold text-purple-500">{stats.inUse}</p>
            </div>
            <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl">
              <HardDrive size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Microcontrollers Table */}
      <div className="bg-surface-primary rounded-2xl p-6 shadow-xl border border-border-primary">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text-primary">ESP Devices</h2>
          <p className="text-text-secondary text-sm mt-1">
            All registered ESP microcontrollers in the system
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="animate-spin text-primary" size={40} />
              <p className="text-text-secondary">Loading ESP devices...</p>
            </div>
          </div>
        ) : microcontrollers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
            <Cpu size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">No ESP devices found</p>
            <p className="text-sm mt-2">ESP devices will appear here once they are registered</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={microcontrollers}
          />
        )}
      </div>
    </div>
  );
};
