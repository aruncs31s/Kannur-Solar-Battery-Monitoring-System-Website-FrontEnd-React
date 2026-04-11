import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, RefreshCw, User, MapPin, Calendar } from 'lucide-react';
import { httpClient } from '../../infrastructure/http/HttpClient';
import { motion } from 'framer-motion';

interface UserRecord {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  location_id?: number;
  created_at: string;
}

export const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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
        <button onClick={load} disabled={loading} className="btn btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
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
    </div>
  );
};
