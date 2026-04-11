import { useEffect, useState, useCallback } from 'react';
import { Bell, Check, CheckCheck, RefreshCw, Info, AlertTriangle, ArrowRightLeft, Settings } from 'lucide-react';
import { httpClient } from '../../infrastructure/http/HttpClient';
import { motion } from 'framer-motion';

interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  ownership_transfer: { icon: <ArrowRightLeft size={16} />, color: 'var(--primary-500)', label: 'Transfer' },
  device_alert:       { icon: <AlertTriangle  size={16} />, color: 'var(--warning)',      label: 'Alert'    },
  system:             { icon: <Settings       size={16} />, color: 'var(--text-tertiary)', label: 'System'  },
};

const getTypeConf = (type: string) =>
  typeConfig[type] ?? { icon: <Info size={16} />, color: 'var(--info)', label: 'Info' };

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await httpClient.get<{ notifications: Notification[]; unread_count: number }>(
        `/notifications${unreadOnly ? '?unread_only=true' : ''}`
      );
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [unreadOnly]);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: number) => {
    await httpClient.put(`/notifications/${id}/read`, {});
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  };

  const markAll = async () => {
    await httpClient.put('/notifications/read-all', {});
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight flex items-center gap-3">
            <Bell className="text-warning-500" size={32} />
            Notifications
          </h1>
          <p className="text-text-tertiary mt-2 text-sm">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setUnreadOnly(v => !v)}
            className={`btn border px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              unreadOnly ? 'bg-primary-500 text-white border-primary-500' : 'bg-surface-secondary text-text-primary border-border-primary'
            }`}
          >
            Unread Only
          </button>
          {unreadCount > 0 && (
            <button onClick={markAll} className="btn btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm">
              <CheckCheck size={16} /> Mark All Read
            </button>
          )}
          <button onClick={load} disabled={loading} className="btn btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="animate-spin text-text-tertiary" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card p-16 text-center">
          <Bell className="mx-auto mb-4 text-text-tertiary" size={40} />
          <p className="text-text-tertiary font-semibold">No notifications {unreadOnly ? 'unread' : ''}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, i) => {
            const conf = getTypeConf(n.type);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`card flex items-start gap-4 p-4 transition-all ${
                  !n.read ? 'border-l-2 bg-surface-secondary border-l-primary-500' : ''
                }`}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: conf.color + '20', color: conf.color }}
                >
                  {conf.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-sm font-bold text-text-primary">{n.title}</span>
                    {!n.read && (
                      <span className="badge" style={{ background: 'var(--primary-500)', color: '#fff', fontSize: '0.6rem', padding: '0.1rem 0.5rem' }}>NEW</span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">{n.message}</p>
                  <p className="text-[10px] text-text-tertiary mt-1 font-mono">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="flex-shrink-0 btn btn-ghost btn-sm flex items-center gap-1 text-primary-500 hover:text-primary-400"
                  >
                    <Check size={14} /> Mark Read
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
