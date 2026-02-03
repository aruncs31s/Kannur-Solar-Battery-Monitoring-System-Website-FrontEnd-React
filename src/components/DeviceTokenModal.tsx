import { useState } from 'react';
import { Copy, Check, X, AlertCircle } from 'lucide-react';

interface DeviceTokenModalProps {
  isOpen: boolean;
  token: string;
  onClose: () => void;
}

export const DeviceTokenModal = ({ isOpen, token, onClose }: DeviceTokenModalProps) => {
  const [tokenCopied, setTokenCopied] = useState(false);

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-primary flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text-primary">Device Authentication Token</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Important Security Information</p>
                <p>This token grants access to device data and control. Keep it secure and do not share it publicly.</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">JWT Token</label>
            <div className="relative">
              <div className="bg-surface-secondary border border-border-primary rounded-lg p-4 font-mono text-sm break-all text-text-primary max-h-48 overflow-y-auto">
                {token}
              </div>
              <button
                onClick={copyToken}
                className={`absolute top-2 right-2 px-3 py-1.5 rounded-md font-medium text-sm transition-all ${
                  tokenCopied
                    ? 'bg-success text-white'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                {tokenCopied ? (
                  <span className="flex items-center gap-1">
                    <Check size={16} />
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Copy size={16} />
                    Copy
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-text-primary">How to use this token:</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm text-text-secondary">
              <li>Copy the token using the button above</li>
              <li>Use it in your API requests as a Bearer token</li>
              <li>Include it in the Authorization header: <code className="bg-surface-secondary px-2 py-1 rounded text-xs">Bearer YOUR_TOKEN</code></li>
              <li>The token contains your user ID and device ID for authentication</li>
            </ol>
          </div>
        </div>

        <div className="p-6 border-t border-border-primary flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};