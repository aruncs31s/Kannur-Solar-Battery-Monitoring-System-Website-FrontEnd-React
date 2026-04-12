
import { User, ArrowRightLeft, History, Lock, Unlock } from 'lucide-react';
import { DeviceOwnership } from '../../../domain/entities/Device';

interface DeviceOwnershipCardProps {
  ownership: DeviceOwnership | null;
  loading: boolean;
  onTransferClick: () => void;
  onVisibilityToggle: (isPublic: boolean) => Promise<void>;
  onViewHistory: () => void;
  canEdit: boolean;
}

export const DeviceOwnershipCard = ({
  ownership,
  loading,
  onTransferClick,
  onVisibilityToggle,
  onViewHistory,
  canEdit
}: DeviceOwnershipCardProps) => {
  if (loading) {
    return (
      <div className="card shadow-sm animate-pulse">
        <div className="card-body p-6 space-y-4">
          <div className="h-6 w-1/3 bg-surface-tertiary rounded"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-surface-tertiary rounded"></div>
            <div className="h-4 w-5/6 bg-surface-tertiary rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!ownership) return null;

  return (
    <div className="card shadow-md border-primary-500/10 hover:shadow-lg transition-all duration-300">
      <div className="card-header border-b border-border-primary/50 pb-4">
        <h2 className="section-title flex items-center gap-2">
          <Lock size={18} className="text-primary-500" />
          Ownership & Privacy
        </h2>
      </div>
      
      <div className="card-body space-y-6">
        {/* Owner Info */}
        <div className="flex items-center gap-4 bg-surface-secondary/50 p-4 rounded-2xl border border-border-primary/30">
          <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
            <User size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-text-tertiary">Current Owner</p>
            <p className="font-bold text-text-primary text-lg">{ownership.owner_name}</p>
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className="flex items-center justify-between p-4 bg-surface-primary border border-border-primary rounded-2xl">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${ownership.is_public ? 'bg-success/10 text-success' : 'bg-nord-10/10 text-nord-10'}`}>
              {ownership.is_public ? <Unlock size={18} /> : <Lock size={18} /> }
            </div>
            <div>
              <p className="font-bold text-sm text-text-primary">
                {ownership.is_public ? 'Public Access' : 'Private Device'}
              </p>
              <p className="text-[11px] text-text-tertiary">
                {ownership.is_public ? 'Visible to all users' : 'Only you and admins can see this'}
              </p>
            </div>
          </div>
          
          {canEdit && (
            <button
              onClick={() => onVisibilityToggle(!ownership.is_public)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                ownership.is_public ? 'bg-success' : 'bg-surface-tertiary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  ownership.is_public ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {canEdit && (
            <button
              onClick={onTransferClick}
              className="flex-1 btn btn-primary flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
            >
              <ArrowRightLeft size={16} />
              Transfer
            </button>
          )}
          <button
            onClick={onViewHistory}
            className="flex-1 btn btn-secondary flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
          >
            <History size={16} />
            History
          </button>
        </div>
      </div>
    </div>
  );
};
