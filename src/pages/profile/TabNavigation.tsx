import { User, HardDrive, Activity, LucideIcon } from 'lucide-react';

export type TabType = 'overview' | 'devices' | 'activity';

export interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  deviceCount: number;
}

export const TabNavigation = ({ activeTab, onTabChange, deviceCount }: TabNavigationProps) => {
  const tabs: Array<{ id: TabType; label: string; icon: LucideIcon }> = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'devices', label: `My Devices (${deviceCount})`, icon: HardDrive },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="border-b border-border-primary">
      <nav className="flex gap-4 px-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`py-4 px-4 border-b-2 font-medium transition-colors ${
              activeTab === id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon size={18} />
              {label}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};
