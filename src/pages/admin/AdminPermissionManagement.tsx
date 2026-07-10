import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Check, AlertTriangle, ShieldCheck, 
  ArrowRightLeft, Search, Loader2, Sparkles, AlertCircle 
} from 'lucide-react';
import { permissionsAPI } from '../../api/permissions';
import { UserPermissionView } from '../../application/types/permissions';
import './AdminPermissionManagement.scss';



interface PermissionDetail {
  key: string;
  name: string;
  description: string;
  risk: 'high' | 'low';
}

const GLOBAL_PERMISSIONS: PermissionDetail[] = [
  {
    key: 'devices:others:view',
    name: 'View Others\' Devices',
    description: 'Allows reading general status and specifications of all registered devices in the system.',
    risk: 'low',
  },
  {
    key: 'devices:others:activity',
    name: 'View Other Devices\' Activity',
    description: 'Allows reading real-time telemetry details, load patterns, and historical readings for all devices.',
    risk: 'low',
  },
  {
    key: 'devices:others:control',
    name: 'Control Others\' Devices',
    description: 'Allows executing controls, toggling operations, and configuring settings on any device.',
    risk: 'high',
  },
  {
    key: 'devices:others:delete',
    name: 'Delete Others\' Devices',
    description: 'Full write/delete access. Allows permanent deletion of any registered node from the platform.',
    risk: 'high',
  },
  {
    key: 'users:all:view',
    name: 'Show All Users',
    description: 'Allows listing and searching all registered user accounts and profiles on the system.',
    risk: 'low',
  },
  {
    key: 'users:all:manage',
    name: 'Manage All Users (Edit)',
    description: 'Allows creating, modifying, and updating credentials or roles for other users.',
    risk: 'high',
  },
  {
    key: 'users:all:delete',
    name: 'Delete Other Users',
    description: 'Allows permanent deletion of user accounts from the database.',
    risk: 'high',
  },
];

export const AdminPermissionManagement = () => {
  const [activeTab, setActiveTab] = useState<'permission' | 'user'>('permission');
  const [users, setUsers] = useState<UserPermissionView[]>([]);
  const [permissionsMap, setPermissionsMap] = useState<Record<string, number[]>>({});
  const [selectedPermission, setSelectedPermission] = useState<string>('devices:others:view');
  const [selectedUser, setSelectedUser] = useState<UserPermissionView | null>(null);
  
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // Transfer Role Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferSourceId, setTransferSourceId] = useState<number | ''>('');
  const [transferTargetId, setTransferTargetId] = useState<number | ''>('');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await permissionsAPI.getPermissions();
      const sanitizedUsers = (response.users || []).map(u => ({
        ...u,
        permissions: u.permissions || []
      }));
      setUsers(sanitizedUsers);
      setPermissionsMap(response.permissions || {});
      
      // Keep selected user reference fresh
      if (selectedUser) {
        const updatedUser = sanitizedUsers.find(u => u.id === selectedUser.id);
        if (updatedUser) setSelectedUser(updatedUser);
      } else if (sanitizedUsers.length > 0) {
        setSelectedUser(sanitizedUsers[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch permission records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (text: string, isError = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTogglePermission = async (userId: number, permKey: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    setActionLoading(true);
    const userPerms = userToUpdate.permissions || [];
    const hasPerm = userPerms.includes(permKey);
    const updatedPerms = hasPerm
      ? userPerms.filter(p => p !== permKey)
      : [...userPerms, permKey];

    try {
      await permissionsAPI.assignPermissions(userId, updatedPerms);
      showToast(`Permission successfully ${hasPerm ? 'revoked' : 'granted'}.`);
      await loadData();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to update permission.', true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferSourceId || !transferTargetId) {
      showToast('Please select both users.', true);
      return;
    }
    if (transferSourceId === transferTargetId) {
      showToast('Cannot transfer permissions to the same user.', true);
      return;
    }

    setActionLoading(true);
    try {
      await permissionsAPI.transferPermissions(Number(transferSourceId), Number(transferTargetId));
      showToast('Roles and permissions successfully transferred!');
      setIsTransferModalOpen(false);
      setTransferSourceId('');
      setTransferTargetId('');
      await loadData();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to transfer roles.', true);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const usersWithSelectedPerm = users.filter(u => 
    permissionsMap[selectedPermission]?.includes(u.id) || (u.permissions || []).includes(selectedPermission)
  );

  return (
    <div className="space-y-8">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-text-primary tracking-tight flex items-center gap-3">
            <Shield className="text-primary-500" size={36} />
            Permission Manager
          </h1>
          <p className="text-text-secondary mt-1">
            Configure system-wide API permissions and perform clean role handovers.
          </p>
        </div>
        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="btn btn-primary bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
        >
          <ArrowRightLeft size={16} />
          Transfer Roles / Handover
        </button>
      </div>

      {/* Main Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary-500 mb-4" size={48} />
          <p className="text-text-secondary">Syncing with permission database...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-error-bg border border-error-border rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-error mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-error">Database Query Failed</h3>
            <p className="text-text-secondary text-sm mt-1">{error}</p>
            <button onClick={loadData} className="btn btn-secondary btn-sm mt-3">Retry</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Navigation Tabs (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-surface-primary border border-border-primary rounded-2xl p-3 shadow-sm space-y-2">
              <button
                onClick={() => setActiveTab('permission')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'permission'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-text-secondary hover:bg-surface-secondary'
                }`}
              >
                <ShieldCheck size={18} />
                By Permission
              </button>
              <button
                onClick={() => setActiveTab('user')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  activeTab === 'user'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-text-secondary hover:bg-surface-secondary'
                }`}
              >
                <Users size={18} />
                By User Profile
              </button>
            </div>

            {/* Quick Warning Banner */}
            <div className="bg-warning-bg/50 border border-warning-border rounded-2xl p-4">
              <div className="flex gap-2">
                <AlertTriangle className="text-warning flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="text-xs font-bold text-text-primary">System Integrity Warning</h4>
                  <p className="text-[11px] text-text-secondary mt-1">
                    High-risk permissions grant access to modify/delete database entries globally. Be careful when assigning them.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Work Area (Span 9) */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              {activeTab === 'permission' ? (
                <motion.div
                  key="perm-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                  {/* Left Column: Permission list (Span 5) */}
                  <div className="md:col-span-5 bg-surface-primary border border-border-primary rounded-2xl p-5 shadow-sm space-y-3">
                    <h3 className="font-bold text-text-primary text-md">Permissions Directory</h3>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                      {GLOBAL_PERMISSIONS.map(perm => (
                        <button
                          key={perm.key}
                          onClick={() => setSelectedPermission(perm.key)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 ${
                            selectedPermission === perm.key
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-sm'
                              : 'border-border-secondary hover:bg-surface-secondary'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-text-primary">{perm.name}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              perm.risk === 'high'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                            }`}>
                              {perm.risk}
                            </span>
                          </div>
                          <span className="text-xs text-text-tertiary line-clamp-1">{perm.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Users holding selection (Span 7) */}
                  <div className="md:col-span-7 bg-surface-primary border border-border-primary rounded-2xl p-5 shadow-sm space-y-4">
                    {(() => {
                      const detail = GLOBAL_PERMISSIONS.find(p => p.key === selectedPermission);
                      return (
                        <>
                          <div className="border-b border-border-secondary pb-4">
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="font-extrabold text-text-primary text-lg">{detail?.name}</h3>
                              <span className={`badge ${detail?.risk === 'high' ? 'badge-error' : 'badge-info'}`}>
                                {detail?.risk === 'high' ? 'High Risk' : 'Low Risk'}
                              </span>
                            </div>
                            <p className="text-text-secondary text-xs mt-2">{detail?.description}</p>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                              Assigned Users ({usersWithSelectedPerm.length})
                            </h4>

                            {usersWithSelectedPerm.length === 0 ? (
                              <div className="py-12 text-center bg-surface-secondary rounded-xl border border-dashed border-border-primary">
                                <Users className="mx-auto text-text-muted opacity-40 mb-2" size={32} />
                                <p className="text-sm font-semibold text-text-secondary">No Assigned Users</p>
                                <p className="text-xs text-text-tertiary mt-1">Go to "By User Profile" to assign this permission.</p>
                              </div>
                            ) : (
                              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {usersWithSelectedPerm.map(u => (
                                  <div
                                    key={u.id}
                                    className="flex justify-between items-center p-3 rounded-xl bg-surface-secondary border border-border-secondary"
                                  >
                                    <div>
                                      <p className="font-bold text-sm text-text-primary">{u.name}</p>
                                      <p className="text-xs text-text-tertiary">@{u.username} • {u.role}</p>
                                    </div>
                                    <span className="text-[10px] bg-success-bg text-success px-2.5 py-1 rounded-lg border border-success-border font-bold">
                                      Active Access
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="user-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                  {/* Left Column: Search & User list (Span 5) */}
                  <div className="md:col-span-5 bg-surface-primary border border-border-primary rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 text-text-muted" size={16} />
                      <input
                        type="text"
                        placeholder="Search profiles..."
                        value={userSearchQuery}
                        onChange={e => setUserSearchQuery(e.target.value)}
                        className="input pl-9"
                      />
                    </div>

                    <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                      {filteredUsers.map(u => (
                        <button
                          key={u.id}
                          onClick={() => setSelectedUser(u)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex justify-between items-center ${
                            selectedUser?.id === u.id
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10 shadow-sm'
                              : 'border-border-secondary hover:bg-surface-secondary'
                          }`}
                        >
                          <div>
                            <p className="font-bold text-sm text-text-primary">{u.name}</p>
                            <p className="text-xs text-text-tertiary">@{u.username}</p>
                          </div>
                          <span className="badge badge-info text-[10px] uppercase font-bold px-2 py-0.5">{u.role}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Toggle permissions panel (Span 7) */}
                  <div className="md:col-span-7 bg-surface-primary border border-border-primary rounded-2xl p-5 shadow-sm space-y-6">
                    {selectedUser ? (
                      <>
                        <div className="border-b border-border-secondary pb-4 flex justify-between items-center">
                          <div>
                            <h3 className="font-extrabold text-text-primary text-lg">{selectedUser.name}</h3>
                            <p className="text-xs text-text-tertiary">@{selectedUser.username} • {selectedUser.email}</p>
                          </div>
                          <span className="badge badge-active uppercase font-bold text-xs">{selectedUser.role}</span>
                        </div>

                        {selectedUser.role === 'admin' ? (
                          <div className="p-4 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-300 dark:border-primary-800 rounded-xl flex gap-3">
                            <Sparkles className="text-primary-500 flex-shrink-0" size={20} />
                            <p className="text-xs text-text-secondary leading-relaxed">
                              This user is an <strong>Administrator</strong>. Administrators inherit all database-wide controls and API overrides automatically. Individual settings do not restrict them.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                              Assigned Permissions
                            </h4>

                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                              {GLOBAL_PERMISSIONS.map(perm => {
                                const hasAccess = (selectedUser.permissions || []).includes(perm.key);
                                return (
                                  <div
                                    key={perm.key}
                                    className="flex items-start justify-between p-3.5 rounded-xl border border-border-secondary bg-surface-secondary hover:border-border-primary transition-colors"
                                  >
                                    <div className="flex-1 pr-4">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm text-text-primary">{perm.name}</span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                          perm.risk === 'high'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                        }`}>
                                          {perm.risk}
                                        </span>
                                      </div>
                                      <p className="text-[11px] text-text-tertiary mt-1 leading-relaxed">
                                        {perm.description}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => handleTogglePermission(selectedUser.id, perm.key)}
                                      disabled={actionLoading}
                                      className={`btn btn-sm min-w-[70px] ${
                                        hasAccess
                                          ? 'bg-success text-white border-success hover:bg-success-bg hover:text-success'
                                          : 'btn-secondary'
                                      }`}
                                    >
                                      {hasAccess ? <Check size={14} /> : 'Grant'}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-20 text-center text-text-muted">
                        <Users className="mx-auto opacity-30 mb-2" size={48} />
                        Select a user to manage their custom permissions.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Transfer Permission Handover Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary border border-border-primary rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-border-secondary">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                <ArrowRightLeft className="text-purple-500" size={20} />
                Transfer System Roles
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Handover all telemetry access, global permission nodes, and role mappings to another staff member.
              </p>
            </div>

            <form onSubmit={handleTransfer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                  Outgoing Staff (Source)
                </label>
                <select
                  value={transferSourceId}
                  onChange={e => setTransferSourceId(e.target.value ? Number(e.target.value) : '')}
                  className="input bg-surface-secondary"
                  required
                >
                  <option value="">Select source user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} (@{u.username}) - {u.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                  Incoming Staff (Target)
                </label>
                <select
                  value={transferTargetId}
                  onChange={e => setTransferTargetId(e.target.value ? Number(e.target.value) : '')}
                  className="input bg-surface-secondary"
                  required
                >
                  <option value="">Select target user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} (@{u.username}) - {u.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-600 dark:text-red-400 leading-relaxed">
                <strong>Attention:</strong> This handover process copies all access layers to the target user and demotes the source user back to default privileges. This operation is logged in the system audit registry.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsTransferModalOpen(false);
                    setTransferSourceId('');
                    setTransferTargetId('');
                  }}
                  disabled={actionLoading}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !transferSourceId || !transferTargetId}
                  className="btn btn-primary bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Transferring...
                    </>
                  ) : (
                    'Confirm Handover'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Status Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`p-4 rounded-xl shadow-xl flex items-center gap-2 border ${
            toastMessage.isError 
              ? 'bg-red-500 text-white border-red-600' 
              : 'bg-green-600 text-white border-green-700'
          }`}>
            <Check size={16} />
            <span className="text-sm font-semibold">{toastMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};
