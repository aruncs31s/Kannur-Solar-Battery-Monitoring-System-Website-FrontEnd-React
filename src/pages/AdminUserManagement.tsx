import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../api/users';
import { User } from '../domain/entities/User';
import {
  Users,
  UserPlus,
  Trash2,
  ArrowLeft,
  Activity,
} from 'lucide-react';

export const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersResponse = await usersAPI.getAll();
      setUsers(usersResponse);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      UserCredentials: {
        username: newUser.username,
        password: newUser.password
      },
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
    console.log('Submitting user data:', userData);
    try {
      await usersAPI.create(userData);
      setNewUser({ name: '', username: '', email: '', password: '', role: 'user' });
      setShowAddUser(false);
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(parseInt(userId));
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Admin Panel
          </Link>
          <h1 className="text-4xl font-bold text-text-primary">User Management</h1>
          <p className="text-text-secondary mt-2">Manage system users and their permissions</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <UserPlus size={20} />
            Add User
          </button>
          <button
            onClick={fetchUsers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Activity size={20} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Total Users</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{users.length}</p>
              <p className="text-xs text-text-secondary">All registered users</p>
            </div>
            <div className="bg-purple-500/10 text-purple-500 p-3 rounded-xl">
              <Users size={32} />
            </div>
          </div>
        </div>
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Admin Users</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-xs text-text-secondary">System administrators</p>
            </div>
            <div className="bg-red-500/10 text-red-500 p-3 rounded-xl">
              <Users size={32} />
            </div>
          </div>
        </div>
        <div className="bg-surface-primary rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-border-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-text-tertiary text-sm font-medium mb-2">Regular Users</p>
              <p className="text-3xl font-bold text-text-primary mb-1">{users.filter(u => u.role === 'user').length}</p>
              <p className="text-xs text-text-secondary">Standard users</p>
            </div>
            <div className="bg-blue-500/10 text-blue-500 p-3 rounded-xl">
              <Users size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-surface-primary rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-border-primary">
          <h2 className="text-2xl font-bold text-text-primary">All Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-secondary border-b border-border-primary">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Username
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border-primary hover:bg-surface-secondary transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-error-600 hover:text-error-900 dark:text-error-400 dark:hover:text-error-300 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto text-text-tertiary mb-2" size={48} />
            <p className="text-text-secondary">No users found</p>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-primary rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-text-primary mb-4">Add New User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-surface-primary text-text-primary focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 border border-border-primary rounded-lg text-text-secondary hover:bg-surface-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};