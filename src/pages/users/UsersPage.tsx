import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, RefreshCw, User, MapPin, Calendar, UserPlus, X, AlertCircle } from 'lucide-react';
import { httpClient } from '../../infrastructure/http/HttpClient';
import { usersAPI } from '../../api/users';
import { UserRecord } from '../../application/types/user';
import { motion, AnimatePresence } from 'framer-motion';
import './UsersPage.scss';



export const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add User Form States
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get<{ users: UserRecord[] }>('/users');
      setUsers(res.users || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  const roleStyle: Record<string, { bg: string; color: string }> = {
    admin:    { bg: 'var(--error-bg)',   color: 'var(--error)' },
    user:     { bg: 'var(--info-bg)',    color: 'var(--info)' },
    operator: { bg: 'var(--warning-bg)', color: 'var(--warning)' },
  };

  const getRoleStyle = (role: string) =>
    roleStyle[role] ?? { bg: 'var(--surface-tertiary)', color: 'var(--text-muted)' };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!username.trim() || !password.trim()) {
      setFormError('Username and password are required.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    setFormLoading(true);
    try {
      await usersAPI.create({
        UserCredentials: {
          username: username.trim(),
          password: password
        },
        name: name.trim(),
        email: email.trim(),
        role: role
      });

      showToast('User created successfully!');
      
      // Reset form & reload
      setName('');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('user');
      setShowAddModal(false);
      
      await load();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create user account.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight flex items-center gap-3">
            <Users className="text-primary-500" size={32} />
            System Users
          </h1>
          <p className="text-text-tertiary mt-2 text-sm">
            {filtered.length} user{filtered.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} disabled={loading} className="btn btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
          >
            <UserPlus size={16} />
            Add User
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="card bg-surface-secondary p-4 flex items-center gap-3">
        <Search size={16} className="text-text-tertiary flex-shrink-0" />
        <input
          type="text"
          placeholder="Search by username, name, or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input flex-1 border-none bg-transparent focus:ring-0 focus:outline-none text-text-primary"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-text-tertiary hover:text-text-primary text-xs">Clear</button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="animate-spin text-text-tertiary" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((u, i) => {
            const rs = getRoleStyle(u.role);
            return (
              <motion.div
                key={u.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card card-interactive p-5 cursor-pointer"
                onClick={() => navigate(`/users/${u.id}/profile`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-500">
                    <User size={20} />
                  </div>
                  <span
                    className="badge text-[10px] font-black uppercase tracking-wider"
                    style={{ background: rs.bg, color: rs.color }}
                  >
                    {u.role}
                  </span>
                </div>

                <p className="text-base font-black text-text-primary tracking-tight">{u.username}</p>
                <p className="text-sm text-text-secondary mt-0.5">{u.name || '—'}</p>

                <div className="mt-3 space-y-1.5 pt-3 border-t border-border-secondary">
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <span className="text-text-muted">✉</span> {u.email || '—'}
                  </div>
                  {u.location_id && (
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <MapPin size={11} /> Location #{u.location_id}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <Calendar size={11} /> Joined {new Date(u.created_at).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card p-16 text-center">
          <Users className="mx-auto mb-4 text-text-tertiary" size={40} />
          <p className="text-text-tertiary font-semibold">No users match your search</p>
        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface-primary border border-border-primary rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-border-secondary flex justify-between items-center">
                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <UserPlus className="text-primary-500" size={20} />
                  Add System User
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-text-tertiary hover:text-text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-start gap-2">
                    <AlertCircle className="mt-0.5 shrink-0" size={14} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Name"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Username"
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                      Confirm *
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-tertiary uppercase tracking-wider mb-2">
                    User Role *
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="input bg-surface-secondary"
                    required
                  >
                    <option value="user">User (Default)</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-border-secondary">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={formLoading}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 font-bold"
                  >
                    {formLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="p-4 bg-green-600 text-white rounded-xl shadow-xl border border-green-700 font-semibold text-sm">
            {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};
