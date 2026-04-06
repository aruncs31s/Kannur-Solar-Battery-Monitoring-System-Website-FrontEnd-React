import { Tag } from 'lucide-react';
import { Version } from '../../../domain/entities/Version';

interface VersionSelectorProps {
  versions: Version[];
  selectedVersion: Version | null;
  onVersionSelect: (version: Version) => void;
  getDeviceCount: (versionId: string | number) => number;
}

export const VersionSelector = ({ versions, selectedVersion, onVersionSelect, getDeviceCount }: VersionSelectorProps) => {
  return (
    <div className="bg-surface-primary rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
        <Tag size={20} />
        Select Version
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {versions.map((version) => {
          const deviceCount = getDeviceCount(version.id);
          const isSelected = selectedVersion?.id === version.id;
          return (
            <button
              key={version.id}
              onClick={() => onVersionSelect(version)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border-primary hover:border-primary/50'
              }`}
            >
              <div className="text-left">
                <p className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                  {version.name}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {deviceCount} {deviceCount === 1 ? 'device' : 'devices'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
