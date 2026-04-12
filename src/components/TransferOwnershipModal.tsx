import { useState, useEffect } from 'react';
import { User as UserIcon, ArrowRightLeft, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { usersAPI } from '../api/users';
import { User } from '../domain/entities/User';

interface TransferOwnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (toUserId: number, note: string) => Promise<void>;
  deviceName: string;
}

export const TransferOwnershipModal = ({
  isOpen,
  onClose,
  onTransfer,
  deviceName
}: TransferOwnershipModalProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [note, setNote] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await usersAPI.getAll();
      setUsers(allUsers);
    } catch (err) {
      setError('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedUser) return;
    
    setTransferring(true);
    setError('');
    try {
      await onTransfer(parseInt(selectedUser.id), note);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSelectedUser(null);
        setNote('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to transfer ownership');
    } finally {
      setTransferring(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Ownership"
      size="md"
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-success-bg/20 rounded-full flex items-center justify-center text-success">
            <CheckCircle2 size={48} />
          </div>
          <h3 className="text-xl font-bold text-text-primary">Transfer Successful</h3>
          <p className="text-text-secondary text-center">
            Ownership of <strong>{deviceName}</strong> has been transferred to <strong>{selectedUser?.name || selectedUser?.username}</strong>.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-nord-10/10 border border-nord-10/20 p-4 rounded-xl flex gap-3 text-nord-10">
            <AlertCircle className="flex-shrink-0" size={20} />
            <p className="text-sm font-medium">
              <strong>Warning:</strong> You will lose administrative control over this device once the transfer is complete.
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
              <UserIcon size={14} /> Select New Owner
            </label>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Search by username or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-secondary border border-border-primary rounded-lg text-sm text-text-primary focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
              />
            </div>

            <div className="max-h-52 overflow-y-auto border border-border-primary rounded-lg divide-y divide-border-primary">
              {loading ? (
                <div className="p-8 text-center text-text-tertiary italic text-sm">Loading users...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-text-tertiary italic text-sm">No users found</div>
              ) : (
                filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                      selectedUser?.id === user.id 
                        ? 'bg-primary-500/10 text-primary-500' 
                        : 'hover:bg-surface-secondary text-text-primary'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm">{user.name || user.username}</p>
                      <p className="text-[11px] opacity-60">@{user.username} &bull; {user.role}</p>
                    </div>
                    {selectedUser?.id === user.id && <CheckCircle2 size={16} />}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-text-secondary flex items-center gap-2">
              Handover Note (Optional)
            </label>
            <textarea
              placeholder="E.g. Reason for transfer or special instructions..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-surface-secondary border border-border-primary rounded-xl text-sm text-text-primary focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-none"
            />
          </div>

          {error && (
            <div className="bg-error-bg/20 text-error p-3 rounded-lg text-xs flex items-center gap-2 border border-error-border/30">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border-primary">
            <button
              onClick={onClose}
              disabled={transferring}
              className="px-6 py-2.5 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleTransfer}
              disabled={!selectedUser || transferring}
              className={`px-6 py-2.5 rounded-lg font-bold text-white shadow-md transition-all flex items-center gap-2 text-sm ${
                !selectedUser || transferring 
                  ? 'bg-text-muted cursor-not-allowed' 
                  : 'bg-primary-500 hover:bg-primary-600 active:scale-95'
              }`}
            >
              {transferring ? (
                <><div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> Processing...</>
              ) : (
                <><ArrowRightLeft size={16} /> Transfer Now</>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
