import { useState } from 'react';
import { X, Download, Code, AlertCircle, Check, Activity } from 'lucide-react';

interface DeviceInfo {
  id: number;
  name: string;
  type: string;
  ip_address: string;
  mac_address: string;
  firmware_version: string;
  address: string;
  city: string;
  device_state: number;
}

interface FirmwareBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: DeviceInfo;
  onBuildAndDownload: (config: any, token: string) => Promise<void>;
  onGenerateToken: () => Promise<string>;
}

export const FirmwareBuilderModal = ({
  isOpen,
  onClose,
  device,
  onBuildAndDownload,
  onGenerateToken
}: FirmwareBuilderModalProps) => {
  const [firmwareBuilding, setFirmwareBuilding] = useState(false);
  const [firmwareMessage, setFirmwareMessage] = useState('');
  const [firmwareConfig, setFirmwareConfig] = useState({
    ip: device.ip_address || '',
    host_ip: '',
    host_ssid: '',
    host_pass: '',
    port: 8080,
    device_name: device.name,
    build_tool: 'platformio'
  });
  const [useManualToken, setUseManualToken] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [firmwareToken, setFirmwareToken] = useState('');

  const closeModal = () => {
    setFirmwareBuilding(false);
    setFirmwareMessage('');
    setUseManualToken(false);
    setManualToken('');
    setFirmwareToken('');
    onClose();
  };

  const generateFirmwareToken = async () => {
    try {
      const token = await onGenerateToken();
      setFirmwareToken(token);
      setFirmwareMessage('Token generated successfully!');
      setTimeout(() => setFirmwareMessage(''), 2000);
    } catch (err: any) {
      setFirmwareMessage('Failed to generate token');
      console.error('Token generation error:', err);
    }
  };

  const buildAndDownloadFirmware = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setFirmwareMessage('Please login to build firmware');
      return;
    }

    const deviceToken = useManualToken ? manualToken : firmwareToken;
    if (!deviceToken) {
      setFirmwareMessage('Please provide or generate a device token first');
      return;
    }

    setFirmwareBuilding(true);
    setFirmwareMessage('Building and downloading firmware...');

    try {
      await onBuildAndDownload(firmwareConfig, deviceToken);
      setFirmwareMessage('Firmware downloaded successfully!');
      setTimeout(() => {
        closeModal();
      }, 2000);
    } catch (err: any) {
      setFirmwareMessage(`Error: ${err.message || 'Failed to build/download firmware'}`);
      console.error('Firmware download error:', err);
    } finally {
      setFirmwareBuilding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-primary rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border-primary flex justify-between items-center">
          <h3 className="text-2xl font-bold text-text-primary">Build Custom Firmware</h3>
          <button
            onClick={closeModal}
            className="text-text-secondary hover:text-text-primary transition-colors"
            disabled={firmwareBuilding}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Code className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-900 dark:text-blue-100">
                <p className="font-semibold mb-1">Firmware Configuration</p>
                <p>Configure your ESP32 microcontroller settings and build custom firmware. Make sure to generate a device token first.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Device Name</label>
              <input
                type="text"
                value={firmwareConfig.device_name}
                onChange={(e) => setFirmwareConfig({ ...firmwareConfig, device_name: e.target.value })}
                className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="ESP32_STATION_1"
                disabled={firmwareBuilding}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Device IP Address</label>
              <input
                type="text"
                value={firmwareConfig.ip}
                onChange={(e) => setFirmwareConfig({ ...firmwareConfig, ip: e.target.value })}
                className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="192.168.1.50"
                disabled={firmwareBuilding}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Host IP Address</label>
              <input
                type="text"
                value={firmwareConfig.host_ip}
                onChange={(e) => setFirmwareConfig({ ...firmwareConfig, host_ip: e.target.value })}
                className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="192.168.1.100"
                disabled={firmwareBuilding}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">Port</label>
              <input
                type="number"
                value={firmwareConfig.port}
                onChange={(e) => setFirmwareConfig({ ...firmwareConfig, port: parseInt(e.target.value) || 8080 })}
                className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="8080"
                disabled={firmwareBuilding}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">WiFi SSID</label>
              <input
                type="text"
                value={firmwareConfig.host_ssid}
                onChange={(e) => setFirmwareConfig({ ...firmwareConfig, host_ssid: e.target.value })}
                className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="MyWiFi"
                disabled={firmwareBuilding}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-secondary mb-2">WiFi Password</label>
              <input
                type="password"
                value={firmwareConfig.host_pass}
                onChange={(e) => setFirmwareConfig({ ...firmwareConfig, host_pass: e.target.value })}
                className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="password123"
                disabled={firmwareBuilding}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-text-secondary mb-2">Build Tool</label>
              <select
                value={firmwareConfig.build_tool}
                onChange={(e) => setFirmwareConfig({ ...firmwareConfig, build_tool: e.target.value })}
                className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={firmwareBuilding}
              >
                <option value="platformio">PlatformIO</option>
                <option value="arduino">Arduino IDE</option>
              </select>
            </div>
          </div>

          {/* Token Management Section */}
          <div className="border-t border-border-primary pt-6">
            <h4 className="text-lg font-semibold text-text-primary mb-4">Device Authentication Token</h4>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tokenType"
                    checked={!useManualToken}
                    onChange={() => setUseManualToken(false)}
                    disabled={firmwareBuilding}
                  />
                  <span className="text-sm font-medium text-text-primary">Auto-generate token</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="tokenType"
                    checked={useManualToken}
                    onChange={() => setUseManualToken(true)}
                    disabled={firmwareBuilding}
                  />
                  <span className="text-sm font-medium text-text-primary">Provide custom token</span>
                </label>
              </div>

              {!useManualToken ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Current Token:</span>
                    <button
                      onClick={generateFirmwareToken}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      disabled={firmwareBuilding}
                    >
                      <Activity size={16} />
                      Generate Token
                    </button>
                  </div>
                  {firmwareToken ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Check className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-green-900 dark:text-green-100">
                          <p className="font-semibold mb-1">Token Generated Successfully</p>
                          <p className="font-mono text-xs break-all">{firmwareToken}</p>
                          <p className="mt-2 text-xs">This token will be used for firmware building.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-yellow-900 dark:text-yellow-100">
                          <p className="font-semibold mb-1">No Token Available</p>
                          <p>Please generate a device token to proceed with firmware building.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-text-secondary">Custom Token</label>
                  <textarea
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-secondary border border-border-primary rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                    placeholder="Paste your JWT token here..."
                    rows={3}
                    disabled={firmwareBuilding}
                  />
                  {manualToken && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Check className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={20} />
                        <div className="text-sm text-green-900 dark:text-green-100">
                          <p className="font-semibold mb-1">Custom Token Provided</p>
                          <p>This token will be used for firmware building.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {firmwareMessage && (
            <div className={`p-4 rounded-lg ${
              firmwareMessage.includes('Error') || firmwareMessage.includes('failed')
                ? 'bg-error/10 text-error'
                : firmwareMessage.includes('success')
                ? 'bg-success/10 text-success'
                : 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
            }`}>
              {firmwareMessage}
            </div>
          )}

          {(!useManualToken && !firmwareToken) || (useManualToken && !manualToken) ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
                <div className="text-sm text-yellow-900 dark:text-yellow-100">
                  <p className="font-semibold mb-1">Device Token Required</p>
                  <p>Please {!useManualToken ? 'generate a device token' : 'provide a custom token'} to proceed with firmware building.</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-6 border-t border-border-primary flex justify-end gap-3">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-surface-secondary hover:bg-surface-tertiary text-text-primary rounded-lg font-medium transition-colors"
            disabled={firmwareBuilding}
          >
            Cancel
          </button>
          <button
            onClick={buildAndDownloadFirmware}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={firmwareBuilding || (!useManualToken && !firmwareToken) || (useManualToken && !manualToken)}
          >
            {firmwareBuilding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Building...
              </>
            ) : (
              <>
                <Download size={20} />
                Build & Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};