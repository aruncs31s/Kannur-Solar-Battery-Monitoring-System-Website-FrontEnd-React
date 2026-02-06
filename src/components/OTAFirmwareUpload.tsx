import { useState } from 'react';
import { X, Wifi, AlertCircle, CheckCircle, Loader2, Zap, Settings, Code } from 'lucide-react';
import { httpClient } from '../infrastructure/http/HttpClient';
import { devicesAPI } from '../api/devices';

interface OTAFirmwareUploadProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: number;
  deviceName: string;
  deviceIp?: string;
}

interface OTAUploadConfig {
  ip: string;
  host_ip: string;
  host_ssid: string;
  host_pass: string;
  port: number;
  protocol: string;
  token: string;
  device_name: string;
  build_tool: string;
  board_fqbn: string;
  device_ip: string; // Target device IP for OTA
}

export const OTAFirmwareUpload = ({
  isOpen,
  onClose,
  deviceId,
  deviceName,
  deviceIp = ''
}: OTAFirmwareUploadProps) => {
  const [config, setConfig] = useState<OTAUploadConfig>({
    ip: deviceIp,
    host_ip: '',
    host_ssid: '',
    host_pass: '',
    port: 8080,
    protocol: 'http',
    token: '',
    device_name: deviceName,
    build_tool: 'platformio',
    board_fqbn: 'esp32:esp32:esp32',
    device_ip: deviceIp
  });

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (log: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
  };

  const handleGenerateToken = async () => {
    try {
      addLog('Generating device token...');
      const response = await devicesAPI.generateDeviceToken(deviceId);
      setConfig({ ...config, token: response.token });
      setMessage('Token generated successfully!');
      setIsSuccess(true);
      addLog('✓ Token generated');
      setTimeout(() => { setMessage(''); setIsSuccess(false); }, 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to generate token';
      setMessage(errorMsg);
      setIsSuccess(false);
      addLog(`✗ ${errorMsg}`);
    }
  };

  const handleOTAUpload = async () => {
    // Validation
    if (!config.device_ip) {
      setMessage('Please enter device IP address');
      return;
    }
    if (!config.host_ssid) {
      setMessage('WiFi SSID is required');
      return;
    }
    if (!config.host_pass) {
      setMessage('WiFi password is required');
      return;
    }
    if (!config.host_ip) {
      setMessage('Backend server IP is required');
      return;
    }
    if (!config.token) {
      setMessage('Device token is required. Click "Generate Token"');
      return;
    }

    setUploading(true);
    setMessage('');
    setIsSuccess(false);
    setLogs([]);

    try {
      addLog(`Starting OTA upload to ${config.device_ip}...`);
      addLog('Building firmware with your configuration...');

      // Call backend API to build and upload
      const response = await httpClient.post<{ message: string; device_ip: string }>(
        '/codegen/upload',
        config
      );

      addLog('✓ Firmware built successfully');
      addLog(`✓ Uploading to device at ${config.device_ip}...`);
      addLog('✓ OTA upload complete!');
      addLog('Device is rebooting...');

      setMessage(response.message || 'Firmware uploaded successfully!');
      setIsSuccess(true);

      // Auto-close after 5 seconds
      setTimeout(() => {
        onClose();
      }, 5000);

    } catch (error: any) {
      let errorMessage = 'OTA upload failed';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = data?.details || data?.error || 'Invalid configuration';
        } else if (status === 500) {
          errorMessage = data?.details || data?.error || 'Server error during build/upload';
        } else {
          errorMessage = data?.details || data?.error || error.message;
        }
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message || 'OTA upload failed';
      }

      addLog(`✗ Error: ${errorMessage}`);
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setConfig({
      ip: deviceIp,
      host_ip: '',
      host_ssid: '',
      host_pass: '',
      port: 8080,
      protocol: 'http',
      token: '',
      device_name: deviceName,
      build_tool: 'platformio',
      board_fqbn: 'esp32:esp32:esp32',
      device_ip: deviceIp
    });
    setUploading(false);
    setMessage('');
    setIsSuccess(false);
    setLogs([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Zap className="text-purple-600 dark:text-purple-300" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                OTA Firmware Upload
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Build & upload to {deviceName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Device Configuration */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <Settings size={20} />
              <h4 className="font-semibold">Device Configuration</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device Name
                </label>
                <input
                  type="text"
                  value={config.device_name}
                  onChange={(e) => setConfig({ ...config, device_name: e.target.value })}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="My Device"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device Static IP
                </label>
                <input
                  type="text"
                  value={config.ip}
                  onChange={(e) => setConfig({ ...config, ip: e.target.value })}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="192.168.1.100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Device IP for OTA *
                </label>
                <input
                  type="text"
                  value={config.device_ip}
                  onChange={(e) => setConfig({ ...config, device_ip: e.target.value })}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  placeholder="192.168.1.100"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Current device IP for OTA upload
                </p>
              </div>
            </div>
          </div>

          {/* WiFi Configuration */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <Wifi size={20} />
              <h4 className="font-semibold">WiFi Configuration</h4>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WiFi SSID *
                  </label>
                  <input
                    type="text"
                    value={config.host_ssid}
                    onChange={(e) => setConfig({ ...config, host_ssid: e.target.value })}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    placeholder="Your WiFi Network"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WiFi Password *
                  </label>
                  <input
                    type="password"
                    value={config.host_pass}
                    onChange={(e) => setConfig({ ...config, host_pass: e.target.value })}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    placeholder="WiFi Password"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backend IP *
                  </label>
                  <input
                    type="text"
                    value={config.host_ip}
                    onChange={(e) => setConfig({ ...config, host_ip: e.target.value })}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    placeholder="192.168.1.10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    value={config.port}
                    onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) || 8080 })}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    placeholder="8080"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Protocol
                  </label>
                  <select
                    value={config.protocol}
                    onChange={(e) => setConfig({ ...config, protocol: e.target.value })}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                  >
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Token Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Device Token *</h4>
              <button
                onClick={handleGenerateToken}
                disabled={uploading}
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50"
              >
                Generate Token
              </button>
            </div>

            {config.token && (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Token:</p>
                <p className="text-xs font-mono break-all text-gray-900 dark:text-white">{config.token}</p>
              </div>
            )}
          </div>

          {/* Build Configuration */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
              <Code size={20} />
              <h4 className="font-semibold">Build Configuration</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Build Tool
                </label>
                <select
                  value={config.build_tool}
                  onChange={(e) => setConfig({ ...config, build_tool: e.target.value })}
                  disabled={uploading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                >
                  <option value="platformio">PlatformIO</option>
                  <option value="arduino-cli">Arduino CLI</option>
                </select>
              </div>

              {config.build_tool === 'arduino-cli' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Board FQBN
                  </label>
                  <input
                    type="text"
                    value={config.board_fqbn}
                    onChange={(e) => setConfig({ ...config, board_fqbn: e.target.value })}
                    disabled={uploading}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    placeholder="esp32:esp32:esp32"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Activity Log</h4>
              <div className="bg-gray-900 dark:bg-gray-950 rounded-lg p-4 max-h-40 overflow-y-auto">
                <div className="space-y-1">
                  {logs.map((log, index) => (
                    <p key={index} className="text-xs font-mono text-green-400">
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              isSuccess
                ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
            }`}>
              {isSuccess ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-semibold mb-1">How it works:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Backend builds firmware with your WiFi & server config</li>
                  <li>Backend uploads firmware to device via OTA</li>
                  <li>Device flashes itself and reboots automatically</li>
                  <li>Device must be online and have OTA endpoint enabled</li>
                  <li>Process takes 1-3 minutes to complete</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Building...' : 'Close'}
          </button>

          <button
            onClick={handleOTAUpload}
            disabled={uploading || !config.device_ip || !config.host_ssid || !config.host_pass || !config.host_ip || !config.token}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Building & Uploading...</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Build & Upload OTA</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
