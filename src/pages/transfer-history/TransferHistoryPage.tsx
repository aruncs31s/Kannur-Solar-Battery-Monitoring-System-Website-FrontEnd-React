import { useEffect, useState, useCallback } from 'react';
import { ArrowRightLeft, RefreshCw, User, Clock, FileText } from 'lucide-react';
import { httpClient } from '../../infrastructure/http/HttpClient';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface TransferLog {
  id: number;
  device_id: number;
  from_user_id: number;
  to_user_id: number;
  transferred_by: number;
  note: string;
  transferred_at: string;
}

export const TransferHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [history, setHistory] = useState<TransferLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await httpClient.get<{ history: TransferLog[]; total: number }>(
        `/devices/${id}/transfer-history`
      );
      setHistory(res.history || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load transfer history');
    } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-text-tertiary text-sm mb-3">
            <Link to={`/devices/${id}`} className="text-primary-500 hover:underline font-bold">
              ← Device #{id}
            </Link>
          </div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight flex items-center gap-3">
            <ArrowRightLeft className="text-primary-500" size={28} />
            Transfer History
          </h1>
          <p className="text-text-tertiary mt-2 text-sm">
            {history.length} ownership transfer{history.length !== 1 ? 's' : ''} on record
          </p>
        </div>
        <button onClick={load} disabled={loading} className="btn btn-secondary flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div className="card p-4 border-l-4 border-error-500 text-error-500 bg-error-500/10 text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="animate-spin text-text-tertiary" size={32} />
        </div>
      ) : history.length === 0 ? (
        <div className="card p-16 text-center">
          <ArrowRightLeft className="mx-auto mb-4 text-text-tertiary" size={40} />
          <p className="text-text-tertiary font-semibold">No ownership transfers recorded</p>
          <p className="text-text-muted text-sm mt-1">The original creator still owns this device.</p>
        </div>
      ) : (
        <div className="relative space-y-0">
          {/* Timeline line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border-primary" />

          {history.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative flex items-start gap-4 pb-6 pl-14"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-4 w-4 h-4 rounded-full bg-primary-500 border-2 border-surface-primary z-10" />

              <div className="card bg-surface-secondary p-5 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-black uppercase tracking-widest text-text-tertiary">
                        #{log.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-text-secondary">
                        <User size={14} /> User #{log.from_user_id}
                      </span>
                      <ArrowRightLeft size={14} className="text-primary-500" />
                      <span className="flex items-center gap-1.5 text-sm font-black text-text-primary">
                        <User size={14} className="text-primary-500" /> User #{log.to_user_id}
                      </span>
                    </div>

                    {log.note && (
                      <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-surface-tertiary">
                        <FileText size={13} className="text-text-tertiary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-text-secondary italic">{log.note}</p>
                      </div>
                    )}

                    {log.transferred_by !== log.from_user_id && (
                      <p className="text-[11px] text-text-tertiary mt-2">
                        Initiated by admin (User #{log.transferred_by})
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-tertiary flex-shrink-0 mt-0.5">
                    <Clock size={11} />
                    {new Date(log.transferred_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
