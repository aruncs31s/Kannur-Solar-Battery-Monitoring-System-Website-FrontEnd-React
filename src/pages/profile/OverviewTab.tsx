import { UserProfile } from './UserInfoCard';

export interface OverviewTabProps {
  user: UserProfile | null;
}

export const OverviewTab = ({ user }: OverviewTabProps) => {
  const infoItems = [
    { label: 'Username', value: user?.username },
    { label: 'Full Name', value: user?.name || 'Not provided' },
    { label: 'Email Address', value: user?.email || 'Not provided' },
    { label: 'Role', value: user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User' },
    { label: 'User ID', value: user?.id, isMonospace: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infoItems.map(({ label, value, isMonospace }) => (
            <div key={label}>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {label}
              </label>
              <p className={`text-lg text-text-primary ${isMonospace ? 'font-mono' : ''}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
        <p className="text-sm text-warning-800">
          <strong>Note:</strong> Profile editing is currently disabled as this feature
          is not yet implemented in the backend. Contact your administrator to update
          your account information.
        </p>
      </div>

      <div className="bg-info-50 border border-info-200 rounded-lg p-6">
        <h3 className="font-semibold text-info-900 mb-2">Security Tips</h3>
        <ul className="text-sm text-info-800 space-y-1">
          <li>• Use a strong password with uppercase, lowercase, numbers, and symbols</li>
          <li>• Change your password regularly</li>
          <li>• Never share your login credentials with anyone</li>
          <li>• Always log out when using shared computers</li>
        </ul>
      </div>
    </div>
  );
};
