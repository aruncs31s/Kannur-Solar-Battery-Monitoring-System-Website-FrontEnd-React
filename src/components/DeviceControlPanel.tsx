import { Power, PowerOff, Settings, RefreshCw } from 'lucide-react';

interface DeviceControlPanelProps {
  deviceState: number;
  canControl: boolean;
  onControl: (action: number) => void;
  onRefresh: () => void;
  onGenerateToken: () => void;
}

export const DeviceControlPanel = ({
  deviceState,
  canControl,
  onControl,
  onRefresh,
  onGenerateToken,
}: DeviceControlPanelProps) => {
  if (!canControl) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Control Panel</h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onControl(4)}
          disabled={deviceState === 1}
          className="flex flex-col items-center justify-center p-4 bg-success hover:bg-success/80 disabled:bg-nord-3 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Power size={24} />
          <span className="mt-2 text-sm font-medium">Turn On</span>
        </button>
        <button
          onClick={() => onControl(5)}
          disabled={deviceState === 2}
          className="flex flex-col items-center justify-center p-4 bg-error hover:bg-error/80 disabled:bg-nord-3 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <PowerOff size={24} />
          <span className="mt-2 text-sm font-medium">Turn Off</span>
        </button>
        <button
          onClick={() => onControl(6)}
          disabled={deviceState === 3 || deviceState === 4}
          className="flex flex-col items-center justify-center p-4 bg-nord-8 hover:bg-nord-9 disabled:bg-nord-3 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Settings size={24} />
          <span className="mt-2 text-sm font-medium">Configure</span>
        </button>
        <button
          onClick={onRefresh}
          className="flex flex-col items-center justify-center p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={24} />
          <span className="mt-2 text-sm font-medium">Refresh</span>
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onGenerateToken}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Generate Device Token
        </button>
      </div>
    </div>
  );
};
