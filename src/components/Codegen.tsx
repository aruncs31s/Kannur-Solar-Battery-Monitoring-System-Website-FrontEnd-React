import { Code, Settings, Check, AlertCircle } from 'lucide-react';

interface CodegenProps {
  onOpenFirmwareModal: () => void;
  onOpenOnlineBuilder: () => void;
  onOpenOTAUpload: () => void;
  onOpenFirmwareUpload: () => void;
  generatedToken?: string;
}

export const Codegen = ({
  onOpenFirmwareModal,
  onOpenOnlineBuilder,
  onOpenOTAUpload,
  onOpenFirmwareUpload,
  generatedToken
}: CodegenProps) => {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg lg:col-span-2">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15">
            <Code className="text-indigo-600 dark:text-indigo-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Custom Firmware Builder</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Build and download custom firmware for your ESP32 microcontroller with your specific configuration.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Step 1</p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Generate device token using the control panel</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Step 2</p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Configure WiFi and network settings</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Step 3</p>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Build and download firmware binary</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={onOpenFirmwareModal}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Code size={20} />
          Open Firmware Builder
        </button>

        <button
          onClick={onOpenOnlineBuilder}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Code size={20} />
          Build Online
        </button>

        <button
          onClick={onOpenOTAUpload}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Settings size={20} />
          OTA Upload
        </button>

        <button
          onClick={onOpenFirmwareUpload}
          className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Settings size={20} />
          Upload to Server
        </button>

        {generatedToken ? (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Check size={16} />
            <span className="font-medium">Device token ready</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
            <AlertCircle size={16} />
            <span className="font-medium">Generate device token first</span>
          </div>
        )}
      </div>
    </div>
  );
};