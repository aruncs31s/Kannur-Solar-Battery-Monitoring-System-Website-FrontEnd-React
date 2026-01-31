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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-nord-6/80 dark:bg-nord-1/80 border-b border-nord-4/50 dark:border-nord-3/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-br from-nord-8 to-nord-10 rounded-xl"
            >
              <Zap className="text-white" size={24} />
            </motion.div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-nord-8 to-nord-10 bg-clip-text text-transparent">
                SKVMS
              </span>
              <p className="text-xs text-nord-3 dark:text-nord-4">Solar Monitor</p>
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
                    ? 'text-white'
                    : 'text-nord-0 dark:text-nord-4 hover:text-nord-8 dark:hover:text-nord-8'
                }`}>
                  {item.name}
                </span>
                {isActivePath(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-nord-8 to-nord-10 rounded-xl"
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
              className="p-2.5 rounded-xl bg-gradient-to-br from-nord-4 to-nord-5 dark:from-nord-2 dark:to-nord-3 text-nord-0 dark:text-nord-4 hover:from-nord-5 hover:to-nord-6 dark:hover:from-nord-3 dark:hover:to-nord-4 transition-all shadow-md"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-nord-5 to-nord-6 dark:from-nord-2 dark:to-nord-3 border border-nord-4 dark:border-nord-3">
              <div className="p-1.5 bg-gradient-to-br from-nord-8 to-nord-10 rounded-lg">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-nord-0 dark:text-nord-4">{user?.name || 'User'}</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-nord-11 to-nord-12 text-white hover:from-nord-11 hover:to-nord-11 transition-all font-semibold text-sm shadow-lg"
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
              className="p-2 rounded-xl bg-nord-4 dark:bg-nord-2 text-nord-0 dark:text-nord-4 hover:bg-nord-5 dark:hover:bg-nord-3 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-gradient-to-br from-nord-8 to-nord-10 text-white"
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
              className="md:hidden overflow-hidden border-t border-nord-4 dark:border-nord-3"
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
                          ? 'bg-gradient-to-r from-nord-8 to-nord-10 text-white shadow-lg'
                          : 'text-nord-0 dark:text-nord-4 hover:bg-nord-5 dark:hover:bg-nord-2'
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
                  className="pt-4 border-t border-nord-4 dark:border-nord-3"
                >
                  <div className="flex items-center gap-2 px-4 py-2 mb-2 rounded-xl bg-nord-5 dark:bg-nord-2">
                    <User size={18} className="text-nord-8 dark:text-nord-8" />
                    <span className="text-sm font-semibold text-nord-0 dark:text-nord-4">{user?.name || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-nord-11 to-nord-12 text-white hover:from-nord-11 hover:to-nord-11 transition-all font-semibold text-sm"
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
