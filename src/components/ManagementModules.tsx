import { Link } from 'react-router-dom';
import { Database, UserCheck, Cpu } from 'lucide-react';

export const ManagementModules = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text-primary">Management Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/devices"
          className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Device Management</p>
              <p className="text-2xl font-bold text-text-primary mb-1">Manage Devices</p>
              <p className="text-xs text-text-secondary">Monitor and control all system devices</p>
            </div>
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">
              <Database size={32} />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/users"
          className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">User Management</p>
              <p className="text-2xl font-bold text-text-primary mb-1">Manage Users</p>
              <p className="text-xs text-text-secondary">Control user accounts and permissions</p>
            </div>
            <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl group-hover:bg-purple-500/20 transition-colors">
              <UserCheck size={32} />
            </div>
          </div>
        </Link>

        <Link
          to="/admin/device-types"
          className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Device Type Management</p>
              <p className="text-2xl font-bold text-text-primary mb-1">Manage Types</p>
              <p className="text-xs text-text-secondary">Configure device types and hardware</p>
            </div>
            <div className="bg-green-500/10 text-green-500 p-3 rounded-xl group-hover:bg-green-500/20 transition-colors">
              <Cpu size={32} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};