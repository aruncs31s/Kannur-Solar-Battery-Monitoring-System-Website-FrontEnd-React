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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>
          Personal Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {infoItems.map(({ label, value, isMonospace }) => (
            <div key={label} style={{ background: 'var(--surface-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-secondary)' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                {label}
              </label>
              <p style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, fontFamily: isMonospace ? 'monospace' : 'inherit' }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '1rem 1.25rem', background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-md)' }}>
        <p style={{ color: 'var(--warning)', fontSize: '0.875rem' }}>
          <strong style={{ fontWeight: 600 }}>Note:</strong> Profile editing is currently disabled. Contact your administrator to update your account information.
        </p>
      </div>

      <div style={{ padding: '1.25rem', background: 'var(--info-bg)', border: '1px solid var(--info-border)', borderRadius: 'var(--radius-md)' }}>
        <h3 style={{ color: 'var(--info)', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>Security Tips</h3>
        <ul style={{ color: 'var(--nord-10)', fontSize: '0.8125rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', listStyle: 'none', padding: 0 }}>
          <li>• Use a strong password with uppercase, lowercase, numbers, and symbols</li>
          <li>• Change your password regularly</li>
          <li>• Never share your login credentials with anyone</li>
          <li>• Always log out when using shared computers</li>
        </ul>
      </div>
    </div>
  );
};
