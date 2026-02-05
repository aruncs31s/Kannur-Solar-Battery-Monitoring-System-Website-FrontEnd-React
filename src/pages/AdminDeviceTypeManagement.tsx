import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { devicesAPI } from '../api/devices';
import {
  Cpu,
  Plus,
  ArrowLeft,
  Activity,
} from 'lucide-react';

export const AdminDeviceTypeManagement = () => {
  const [deviceTypes, setDeviceTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [hardwareTypes, setHardwareTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddDeviceType, setShowAddDeviceType] = useState(false);
  const [newDeviceType, setNewDeviceType] = useState({
    name: '',
    hardware_type: 1
  });

  useEffect(() => {
    fetchDeviceTypes();
  }, []);

  const fetchDeviceTypes = async () => {
    setLoading(true);
    try {
      const data = await devicesAPI.getHardwareDeviceTypes();
      setDeviceTypes(data.device_type);
      setHardwareTypes(data.device_type);
      setError('');
    } catch (err) {
      setError('Failed to fetch device types');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeviceType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await devicesAPI.createDeviceType(newDeviceType);
      setNewDeviceType({ name: '', hardware_type: 1 });
      setShowAddDeviceType(false);
      fetchDeviceTypes();
    } catch (err) {
      setError('Failed to create device type');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading device types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-text-primary">Device Type Management</h1>
          <p className="text-text-secondary mt-2">Manage device types and hardware configurations</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddDeviceType(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Device Type
          </button>
          <button
            onClick={fetchDeviceTypes}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Activity size={20} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Device Type Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Total Device Types</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{deviceTypes.length}</p>
              <p className="text-xs text-text-secondary">Available device types</p>
            </div>
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl">
              <Cpu size={32} />
            </div>
          </div>
        </div>
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Hardware Types</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{hardwareTypes.length}</p>
              <p className="text-xs text-text-secondary">Supported hardware</p>
            </div>
            <div className="bg-green-500/10 text-green-500 p-3 rounded-xl">
              <Cpu size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Device Type Management Table */}
      <div className="bg-surface-primary rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary">Device Types</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-secondary border-b border-border-primary">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Hardware Type
                </th>
              </tr>
            </thead>
            <tbody>
              {deviceTypes.map((type) => (
                <tr
                  key={type.id}
                  className="border-b border-border-primary hover:bg-surface-secondary transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {type.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {type.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {hardwareTypes.find(ht => ht.id === type.id)?.name || 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {deviceTypes.length === 0 && (
          <div className="text-center py-12">
            <Cpu className="mx-auto text-text-tertiary mb-2" size={48} />
            <p className="text-text-secondary">No device types found</p>
          </div>
        )}
      </div>

      {/* Add Device Type Modal */}
      {showAddDeviceType && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-text-primary mb-4">Add New Device Type</h3>
            <form onSubmit={handleCreateDeviceType}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Device Type Name
                  </label>
                  <input
                    type="text"
                    value={newDeviceType.name}
                    onChange={(e) => setNewDeviceType({ ...newDeviceType, name: e.target.value })}
                    placeholder="e.g., Raspberry Pi, Arduino"
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Hardware Type
                  </label>
                  <select
                    value={newDeviceType.hardware_type}
                    onChange={(e) => setNewDeviceType({ ...newDeviceType, hardware_type: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {hardwareTypes.map((ht) => (
                      <option key={ht.id} value={ht.id}>
                        {ht.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddDeviceType(false)}
                  className="flex-1 px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  Add Device Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};