import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Moon, Sun, Zap, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useSearchStore } from '../store/searchStore';
import { SearchBar } from './SearchBar';
import { devicesAPI } from '../api/devices';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{id: number, name: string}>>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { query, setQuery } = useSearchStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'My Devices', path: '/my-devices' },
    { name: 'My Microcontrollers', path: '/my-microcontrollers' },
    { name: 'Devices', path: '/devices' },
    { name: 'Readings', path: '/readings' },
    { name: 'Map', path: '/map' },
    { name: 'Locations', path: '/locations' },
    { name: 'Audit', path: '/audit' },
    { name: 'Admin', path: '/admin' },
  ];

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim() === '') {
        setSearchResults([]);
        return;
      }
      try {
        const results = await devicesAPI.searchDevices(query);
        setSearchResults(results.slice(0, 5)); // Limit to 5 results
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      }
    };
    fetchSearchResults();
  }, [query]);

  const mainNavItems = navItems.slice(0, 4); // Dashboard, My Devices, My Microcontrollers, Devices
  const moreNavItems = navItems.slice(4); // Readings, Map, Audit, Admin

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
            {mainNavItems.map((item) => (
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
            {moreNavItems.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className="relative px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-1 text-text-secondary hover:text-text-accent"
                >
                  More
                  <ChevronDown size={16} className={`transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-surface-primary border border-border-primary rounded-xl shadow-lg py-2 z-50"
                    >
                      {moreNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block px-4 py-2 text-sm transition-all ${
                            isActivePath(item.path)
                              ? 'bg-primary-200 text-text-primary'
                              : 'text-text-secondary hover:bg-surface-secondary'
                          }`}
                          onClick={() => setIsMoreOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <SearchBar
              placeholder="Search devices..."
              value={query}
              onChange={setQuery}
              expandable={true}
              isExpanded={isSearchExpanded}
              onToggleExpand={() => setIsSearchExpanded(!isSearchExpanded)}
              results={searchResults}
              className={isSearchExpanded ? "w-64" : ""}
            />
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
              <span className="text-sm font-semibold text-text-primary">{user?.username || 'User'}</span>
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
