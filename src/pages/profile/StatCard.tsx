import { ReactNode } from 'react';

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  iconColor: string;
}

export const StatCard = ({ icon, label, value, bgColor, iconColor }: StatCardProps) => {
  return (
    <div className={`${bgColor} p-4 rounded-lg`}>
      <div className={`flex items-center gap-2 ${iconColor} mb-1`}>
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${iconColor.replace('text-', 'text-').replace('-600', '-900').replace('-700', '-900')}`}>
        {value}
      </p>
    </div>
  );
};
