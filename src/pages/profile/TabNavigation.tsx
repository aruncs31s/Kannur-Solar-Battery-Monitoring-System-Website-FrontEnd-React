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
    <div style={{ borderBottom: '1px solid var(--border-secondary)' }}>
      <nav style={{ display: 'flex', gap: '1rem', padding: '0 1.5rem' }}>
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '1rem 0.5rem',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--mc-color)' : '2px solid transparent',
                color: isActive ? 'var(--mc-color)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
