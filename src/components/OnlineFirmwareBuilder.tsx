import { useState, useEffect } from 'react';
import { X, Download, Loader2, CheckCircle, AlertCircle, Code, Wifi, Settings } from 'lucide-react';
import { devicesAPI, FirmwareBuildConfig, FirmwareBuildStatus } from '../api/devices';

interface OnlineFirmwareBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  deviceId: number;
  deviceName: string;
  deviceIp?: string;
}

export const OnlineFirmwareBuilder = ({
  isOpen,
  onClose,
  deviceId,
  deviceName,
  deviceIp
}: OnlineFirmwareBuilderProps) => {
  const [config, setConfig] = useState<FirmwareBuildConfig>({
    device_id: deviceId,
    device_name: deviceName || '',
    ip: deviceIp || '',
    host_ip: '',
    host_ssid: '',
    host_pass: '',
    port: 8080,
    build_tool: 'platformio'
  });

  const [building, setBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState<FirmwareBuildStatus | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [manualToken, setManualToken] = useState('');

  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval> | null = null;

    if (buildStatus && buildStatus.status === 'building') {
      pollInterval = setInterval(async () => {
        try {
          const status = await devicesAPI.getFirmwareBuildStatus(buildStatus.build_id);
          setBuildStatus(status);

          if (status.status === 'completed' || status.status === 'failed') {
            if (pollInterval) clearInterval(pollInterval);
          }
        } catch (err) {
          console.error('Failed to poll build status:', err);
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [buildStatus]);

  const handleGenerateToken = async () => {
    try {
      const response = await devicesAPI.generateDeviceToken(deviceId);
      setManualToken(response.token);
      setConfig({ ...config, token: response.token });
      setMessage('Token generated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate token');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleBuildFirmware = async () => {
    // Validation
    if (!config.host_ssid) {
      setError('WiFi SSID is required');
      return;
    }
    if (!config.host_pass) {
      setError('WiFi Password is required');
      return;
    }
    if (!config.host_ip) {
      setError('Backend Server IP is required');
      return;
    }

    setBuilding(true);
    setError('');
    setMessage('');
    setBuildStatus(null);

    try {
      const response = await devicesAPI.buildFirmware(config);
      // Cast response to include progress field
      setBuildStatus({
        build_id: response.build_id,
        status: response.status,
        progress: 0,
        message: response.message,
      });
      setMessage('Firmware build started!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start firmware build');
      setBuilding(false);
    }
  };

  const handleDownloadFirmware = async () => {
    if (!buildStatus?.build_id) return;

    try {
      const blob = await devicesAPI.downloadFirmware(buildStatus.build_id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.device_name || 'firmware'}_${buildStatus.build_id}.bin`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessage('Firmware downloaded successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to download firmware');
    }
  };

  const handleClose = () => {
    setConfig({
      device_id: deviceId,
      device_name: deviceName || '',
      ip: deviceIp || '',
      host_ip: '',
      host_ssid: '',
      host_pass: '',
      port: 8080,
      build_tool: 'platformio'
    });
    setBuilding(false);
    setBuildStatus(null);
    setMessage('');
    setError('');
    setManualToken('');
    onClose();
  };

  if (!isOpen) return null;

  const isCompleted = buildStatus?.status === 'completed';
  const isFailed = buildStatus?.status === 'failed';
  const isBuilding = buildStatus?.status === 'building' || buildStatus?.status === 'queued';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Code className="text-blue-600 dark:text-blue-300" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Online Firmware Builder
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {deviceName}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="My Device"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Device IP (Static)
                </label>
                <input
                  type="text"
                  value={config.ip}
                  onChange={(e) => setConfig({ ...config, ip: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="192.168.1.100"
                />
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  WiFi SSID *
                </label>
                <input
                  type="text"
                  value={config.host_ssid}
                  onChange={(e) => setConfig({ ...config, host_ssid: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Your WiFi Network Name"
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Your WiFi Password"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backend Server IP *
                  </label>
                  <input
                    type="text"
                    value={config.host_ip}
                    onChange={(e) => setConfig({ ...config, host_ip: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="192.168.1.10"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Backend Port
                  </label>
                  <input
                    type="number"
                    value={config.port}
                    onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="8080"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Token Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Device Token</h4>
              <button
                onClick={handleGenerateToken}
                disabled={building}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              >
                Generate New Token
              </button>
            </div>

            {manualToken && (
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Generated Token:</p>
                <p className="text-sm font-mono break-all text-gray-900 dark:text-white">{manualToken}</p>
              </div>
            )}
          </div>

          {/* Build Tool Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Build Tool
            </label>
            <select
              value={config.build_tool}
              onChange={(e) => setConfig({ ...config, build_tool: e.target.value as 'platformio' | 'arduino' })}
              disabled={building}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="platformio">PlatformIO</option>
              <option value="arduino">Arduino CLI</option>
            </select>
          </div>

          {/* Build Status */}
          {buildStatus && (
            <div className={`p-4 rounded-lg border-2 ${
              isCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' :
              isFailed ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700' :
              'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {isBuilding && <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={20} />}
                  {isCompleted && <CheckCircle className="text-green-600 dark:text-green-400" size={20} />}
                  {isFailed && <AlertCircle className="text-red-600 dark:text-red-400" size={20} />}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {isBuilding && 'Building...'}
                    {isCompleted && 'Build Completed!'}
                    {isFailed && 'Build Failed'}
                  </span>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{buildStatus.progress}%</span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-green-600' :
                    isFailed ? 'bg-red-600' :
                    'bg-blue-600'
                  }`}
                  style={{ width: `${buildStatus.progress}%` }}
                ></div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300">{buildStatus.message}</p>
            </div>
          )}

          {/* Messages */}
          {message && (
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
              <CheckCircle size={16} />
              <span className="text-sm">{message}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={handleClose}
            disabled={isBuilding}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Close
          </button>

          {isCompleted && (
            <button
              onClick={handleDownloadFirmware}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              <span>Download Firmware</span>
            </button>
          )}

          {!buildStatus && (
            <button
              onClick={handleBuildFirmware}
              disabled={building || !config.host_ssid || !config.host_pass || !config.host_ip}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {building && <Loader2 className="animate-spin" size={16} />}
              <Code size={16} />
              <span>{building ? 'Building...' : 'Build Firmware'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
