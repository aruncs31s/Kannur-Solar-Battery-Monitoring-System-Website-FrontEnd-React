import { Package, ChevronRight } from 'lucide-react';
import { Device } from '../../../domain/entities/Device';
import { Version } from '../../../domain/entities/Version';

interface DeviceListProps {
  devices: Device[];
  versions: Version[];
  selectedDevice: Device | null;
  onDeviceSelect: (device: Device) => void;
}

export const DeviceList = ({ devices, versions, selectedDevice, onDeviceSelect }: DeviceListProps) => {
  return (
    <div className="lg:col-span-1 bg-surface-primary rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
        <Package size={20} />
        Devices & Versions
      </h2>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {devices.map((device) => {
          const version = versions.find(v => v.id.toString() === device.version_id.toString());
          const isSelected = selectedDevice?.id === device.id;
          return (
            <div
              key={device.id}
              onClick={() => onDeviceSelect(device)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-secondary hover:bg-surface-tertiary'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className={`font-semibold ${isSelected ? 'text-white' : 'text-text-primary'}`}>
                    {device.name}
                  </p>
                  <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-text-secondary'}`}>
                    {device.type}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    {version?.name || 'N/A'}
                  </div>
                  {isSelected && <ChevronRight size={16} />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {devices.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <Package className="mx-auto mb-2" size={32} />
          <p>No devices found</p>
        </div>
      )}
    </div>
  );
};
