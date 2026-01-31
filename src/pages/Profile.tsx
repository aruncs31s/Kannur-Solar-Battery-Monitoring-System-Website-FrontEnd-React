import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { FormError } from '../components/FormComponents';
import { User } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Note: Profile editing is disabled as the backend doesn't support user updates yet
        // This is just to ensure we have the latest user data
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold text-text-primary">User Profile</h1>
        <p className="text-text-secondary mt-2">View your account information</p>
      </div>

      {error && <FormError message={error} />}

      <div className="bg-surface-primary rounded-lg shadow-md p-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary-100 p-4 rounded-full">
                <User className="text-primary-500" size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary">{user?.name}</h2>
                <p className="text-text-secondary">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border-primary">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Full Name
                </label>
                <p className="text-lg text-text-primary">{user?.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Email Address
                </label>
                <p className="text-lg text-text-primary">{user?.email}</p>
              </div>
            </div>

            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-warning-800">
                <strong>Note:</strong> Profile editing is currently disabled as this feature is not yet implemented in the backend. Contact your administrator to update your account information.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Additional Security Info */}
      <div className="bg-info-50 border border-info-200 rounded-lg p-6">
        <h3 className="font-semibold text-info-900 mb-2">Security Tip</h3>
        <ul className="text-sm text-info-800 space-y-1">
          <li>• Use a strong password with uppercase, lowercase, numbers, and symbols</li>
          <li>• Change your password regularly</li>
          <li>• Never share your login credentials with anyone</li>
        </ul>
      </div>
    </div>
  );
};
