import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, TrendingUp, MapPin, Wifi, Settings, Clock, Eye, Activity, HardDrive, X, Copy, Check, AlertCircle } from 'lucide-react';
import { StatusBadge } from './Cards';
import { devicesAPI } from '../api/devices';
import { useState } from 'react';

interface AllDevicesSectionProps {
  devices: any[];
  showGenerateToken?: boolean;
  maxDevices?: number;
  title?: string;
  showViewAllLink?: boolean;
}

export const AllDevicesSection = ({ devices, showGenerateToken = false, maxDevices = 6, title = "All Devices", showViewAllLink = true }: AllDevicesSectionProps) => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [generatedToken, setGeneratedToken] = useState('');
  const [tokenCopied, setTokenCopied] = useState(false);

  const handleGenerateToken = async (deviceId: number) => {
    setSelectedDeviceId(deviceId);

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
    setSelectedDeviceId(null);
  };

  return (
    <>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
              <Cpu className="text-white" size={24} />
            </div>
            {title}
          </h2>
          {showViewAllLink && (
            <Link to="/devices" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-semibold transition-colors">
              View All
              <TrendingUp size={16} />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.slice(0, maxDevices).map((device, idx) => (
            <motion.div key={device.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: idx * 0.05 }} whileHover={{ y: -4, scale: 1.02 }}>
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-5 hover:shadow-2xl hover:border-gray-300 dark:hover:border-gray-600 transition-all bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <Link to={`/devices/${device.id}`} className="block">
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">{device.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">{device.mac_address}</p>
                    </Link>
                  </div>
                  <StatusBadge status={device.device_state === 1 ? 'active' : device.device_state === 2 ? 'inactive' : 'unknown'} />
                </div>
                <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="font-medium">{device.address || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                    <Cpu size={16} className="text-success" />
                    <span className="font-medium">{device.type}</span>
                  </div>
                </div>
                {showGenerateToken && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleGenerateToken(device.id)}
                      className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      Generate Token
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

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