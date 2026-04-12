import { useState } from 'react';
import { Copy, Check, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Device Authentication Token"
      size="lg"
    >
      <div className="space-y-6">
        <div className="bg-info-bg border border-info-border rounded-xl p-5 shadow-sm animate-in fade-in duration-500">
          <div className="flex items-start gap-4">
            <div className="bg-info/20 p-2 rounded-lg">
              <AlertCircle className="text-info flex-shrink-0" size={24} />
            </div>
            <div>
              <p className="font-bold text-text-primary mb-1">Important Security Information</p>
              <p className="text-sm text-text-secondary leading-relaxed">
                This token grants direct access to your device's data and controls. 
                <span className="font-bold text-text-primary"> Never share this token publicly</span> or include it in client-side code that isn't yours.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-text-secondary mb-3 px-1">JWT Token</label>
          <div className="relative group">
            <div className="bg-surface-secondary border border-border-primary rounded-xl p-5 font-mono text-sm break-all text-text-primary max-h-48 overflow-y-auto shadow-inner group-hover:border-primary-500/50 transition-colors">
              {token}
            </div>
            <button
              onClick={copyToken}
              className={`absolute top-3 right-3 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 ${
                tokenCopied
                  ? 'bg-success text-white'
                  : 'bg-primary-500 hover:bg-primary-600 text-white'
              }`}
            >
              {tokenCopied ? (
                <span className="flex items-center gap-1.5">
                  <Check size={16} />
                  Copied!
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Copy size={16} />
                  Copy
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="bg-surface-primary/50 rounded-xl p-5 border border-border-primary">
          <h4 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <div className="w-1.5 h-4 bg-primary-500 rounded-full" />
            Integration Guide
          </h4>
          <ol className="space-y-3">
            {[
              { step: 1, text: "Click the copy button above to get your unique JWT." },
              { step: 2, text: "Add an Authorization header to your HTTPS requests." },
              { step: 3, text: "Format the header as: Bearer <your_token>.", isCode: true },
              { step: 4, text: "The token remains valid until you regenerate it from the registry." }
            ].map((item) => (
              <li key={item.step} className="flex gap-3 text-sm text-text-secondary">
                <span className="flex-shrink-0 w-6 h-6 bg-surface-tertiary text-text-primary rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-border-primary">
                  {item.step}
                </span>
                <span className="pt-0.5">{item.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex justify-end pt-4 border-t border-border-primary">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-bold transition-all active:scale-95 shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};