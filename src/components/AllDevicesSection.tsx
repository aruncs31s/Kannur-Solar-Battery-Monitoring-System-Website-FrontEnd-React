import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, TrendingUp, MapPin, X, Copy, Check, AlertCircle } from 'lucide-react';
import { StatusBadge } from './Cards';
import { Section } from './Section';
import { devicesAPI } from '../api/devices';
import { useState } from 'react';
import { DeviceResponseDTO} from '../domain/entities/Device';

interface AllDevicesSectionProps {
  devices: DeviceResponseDTO[];
  showGenerateToken?: boolean;
  maxDevices?: number;
  title?: string;
  showViewAllLink?: boolean;
}

export const AllDevicesSection = ({ devices, showGenerateToken = false, maxDevices = 6, title = "All Devices", showViewAllLink = true }: AllDevicesSectionProps) => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');
  const [tokenCopied, setTokenCopied] = useState(false);

  const handleGenerateToken = async (deviceId: number) => {
    try {
      const response = await devicesAPI.generateDeviceToken(deviceId);
      setGeneratedToken(response.token);
      setShowTokenModal(true);
      setTokenCopied(false);
    } catch (err: any) {
      console.error('Token generation error:', err);
    }
  };

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(generatedToken);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
    }
  };

  const closeTokenModal = () => {
    setShowTokenModal(false);
    setGeneratedToken('');
    setTokenCopied(false);
  };

  return (
    <>
      <Section
        title={title}
        icon={Cpu}
        headerAction={
          showViewAllLink && (
            <Link to="/devices" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary font-semibold transition-colors">
              View All
              <TrendingUp size={16} />
            </Link>
          )
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.slice(0, maxDevices).map((device, idx) => (
            <motion.div key={device.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="relative overflow-hidden bg-surface-primary rounded-2xl p-6 shadow-xl shadow-primary-200/20 hover:shadow-2xl transition-all duration-300 border border-border-primary">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-400 opacity-10 rounded-full blur-2xl" />
                <div className="relative flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link to={`/devices/${device.id}`} className="block">
                      <h3 className="font-bold text-lg text-text-primary mb-1">{device.name}</h3>
                      <p className="text-xs text-text-muted font-mono">{device.mac_address}</p>
                    </Link>
                  </div>
                  
                  <StatusBadge status={device.status} />
                </div>
                <div className="relative space-y-2.5 text-sm text-text-secondary">
                  <div className="flex items-center gap-2 bg-surface-tertiary rounded-lg px-3 py-2">
                    <MapPin size={16} className="text-text-muted" />
                    <span className="font-medium">{device.address || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-tertiary rounded-lg px-3 py-2">
                    <Cpu size={16} className="text-success" />
                    <span className="font-medium">{device.type}</span>
                  </div>
                </div>
                {showGenerateToken && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleGenerateToken(device.id)}
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-lg hover:shadow-primary-500/20"
                    >
                      Generate Token
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Token Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary flex justify-between items-center">
              <h3 className="text-2xl font-bold text-text-primary">Device Authentication Token</h3>
              <button
                onClick={closeTokenModal}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-info-bg border border-info-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-info flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm text-text-primary">
                    <p className="font-semibold mb-1">Important Security Information</p>
                    <p className="opacity-80">This token grants access to device data and control. Keep it secure and do not share it publicly.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">JWT Token</label>
                <div className="relative">
                  <div className="bg-surface-secondary border border-border-primary rounded-lg p-4 font-mono text-sm break-all text-text-primary max-h-48 overflow-y-auto">
                    {generatedToken}
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
                onClick={closeTokenModal}
                className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};