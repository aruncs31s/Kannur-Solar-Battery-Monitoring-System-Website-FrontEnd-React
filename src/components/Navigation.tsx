import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Devices', path: '/devices' },
    { name: 'Map', path: '/map' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="font-semibold text-lg text-gray-900">
            Solar Monitor
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50">
              <User size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">{user?.name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 transition-colors font-medium text-sm flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-gray-700 hover:text-blue-600 py-3 font-medium text-sm"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-50 my-4">
              <User size={18} className="text-gray-600" />
              <span className="text-sm text-gray-700">{user?.name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center gap-2 py-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
