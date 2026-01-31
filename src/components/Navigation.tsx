import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Moon, Sun, Zap } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Devices', path: '/devices' },
    { name: 'Readings', path: '/readings' },
    { name: 'Map', path: '/map' },
    { name: 'Audit', path: '/audit' },
    { name: 'Admin', path: '/admin' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-surface-primary/80 border-b border-border-primary/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-primary-200 rounded-xl"
            >
              <Zap className="text-text-primary" size={24} />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-xl text-text-primary">
                Kannur Solar
              </span>
              <span className="text-xs text-text-tertiary -mt-1">
                Battery Monitor
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 rounded-xl font-medium text-sm transition-all"
              >
                <span className={`relative z-10 ${
                  isActivePath(item.path)
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-accent'
                }`}>
                  {item.name}
                </span>
                {isActivePath(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary-200 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Info and Logout */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-surface-secondary text-text-secondary hover:bg-surface-tertiary transition-all shadow-md"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-secondary border border-border-primary">
              <div className="p-1.5 bg-primary-200 rounded-lg">
                <User size={14} className="text-text-primary" />
              </div>
              <span className="text-sm font-semibold text-text-primary">{user?.name || 'User'}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-error text-text-primary hover:bg-error/80 transition-all font-semibold text-sm shadow-lg"
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-surface-secondary text-text-secondary hover:bg-surface-tertiary transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-primary-200 text-text-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-border-primary"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        isActivePath(item.path)
                          ? 'bg-primary-200 text-text-primary shadow-lg'
                          : 'text-text-secondary hover:bg-surface-secondary'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.05 }}
                  className="pt-4 border-t border-border-primary"
                >
                  <div className="flex items-center gap-2 px-4 py-2 mb-2 rounded-xl bg-surface-secondary">
                    <User size={18} className="text-text-accent" />
                    <span className="text-sm font-semibold text-text-primary">{user?.name || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-error text-text-primary hover:bg-error/80 transition-all font-semibold text-sm"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
