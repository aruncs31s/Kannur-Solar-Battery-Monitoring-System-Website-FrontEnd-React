import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, LogOut, User, Moon, Sun, Zap, ChevronDown,
  LayoutDashboard, Cpu, MapPin, Map,
  Shield, FileText, Activity
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useSearchStore } from '../store/searchStore';
import { SearchBar } from './SearchBar';
import { devicesAPI } from '../api/devices';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
}

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: number; name: string }>>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { query, setQuery } = useSearchStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { name: 'Dashboard',        path: '/',                  icon: <LayoutDashboard size={15} /> },
    { name: 'Solar Devices',    path: '/solar-devices',     icon: <Sun size={15} /> },
    { name: 'Locations',        path: '/locations',         icon: <MapPin size={15} /> },
    { name: 'Map',              path: '/map',               icon: <Map size={15} /> },
    { name: 'Microcontrollers', path: '/my-microcontrollers', icon: <Cpu size={15} /> },
    { name: 'My Devices',       path: '/my-devices',        icon: <Zap size={15} /> },
    { name: 'All Devices',      path: '/devices',           icon: <Cpu size={15} /> },
    { name: 'Readings',         path: '/readings',          icon: <Activity size={15} /> },
    { name: 'Audit',            path: '/audit',             icon: <FileText size={15} /> },
    { name: 'Admin',            path: '/admin',             icon: <Shield size={15} />, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role || '');
  });

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim() === '') { setSearchResults([]); return; }
      try {
        const results = await devicesAPI.searchDevices(query);
        setSearchResults(results.slice(0, 5));
      } catch { setSearchResults([]); }
    };
    fetchSearchResults();
  }, [query]);

  const mainNavItems = filteredNavItems.slice(0, 4);  // Dashboard, Solar, Locations, Map
  const moreNavItems = filteredNavItems.slice(4);

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'var(--surface-primary)',
        borderBottom: '1px solid var(--border-primary)',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{ padding: '0.45rem', background: 'var(--solar-bg)', borderRadius: 'var(--radius-md)', color: 'var(--solar-color)' }}>
              <Zap size={20} />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                Kannur Solar
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.02em' }}>
                Battery Monitor
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.25rem' }}>
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{ position: 'relative', textDecoration: 'none' }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.4rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8375rem',
                    fontWeight: isActivePath(item.path) ? 600 : 500,
                    color: isActivePath(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActivePath(item.path) ? 'var(--surface-secondary)' : 'transparent',
                    border: isActivePath(item.path) ? '1px solid var(--border-primary)' : '1px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={e => { if (!isActivePath(item.path)) (e.currentTarget as HTMLElement).style.background = 'var(--surface-secondary)'; }}
                  onMouseLeave={e => { if (!isActivePath(item.path)) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span style={{ opacity: isActivePath(item.path) ? 1 : 0.65 }}>{item.icon}</span>
                  {item.name}
                </span>
              </Link>
            ))}

            {/* More Dropdown */}
            {moreNavItems.length > 0 && (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    padding: '0.4rem 0.875rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8375rem', fontWeight: 500,
                    color: 'var(--text-secondary)',
                    background: 'transparent', border: '1px solid transparent',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface-secondary)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  More
                  <ChevronDown size={14} style={{ transform: isMoreOpen ? 'rotate(180deg)' : '', transition: 'transform 0.2s' }} />
                </button>
                <AnimatePresence>
                  {isMoreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                        width: 200, background: 'var(--surface-primary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                        padding: '0.35rem', zIndex: 60,
                      }}
                    >
                      {moreNavItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMoreOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.625rem',
                            padding: '0.5rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.8375rem', fontWeight: isActivePath(item.path) ? 600 : 400,
                            color: isActivePath(item.path) ? 'var(--text-accent)' : 'var(--text-secondary)',
                            background: isActivePath(item.path) ? 'var(--surface-secondary)' : 'transparent',
                            textDecoration: 'none', transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => { if (!isActivePath(item.path)) (e.currentTarget as HTMLElement).style.background = 'var(--surface-secondary)'; }}
                          onMouseLeave={e => { if (!isActivePath(item.path)) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <span style={{ opacity: 0.7 }}>{item.icon}</span>
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
              className={isSearchExpanded ? 'w-60' : ''}
            />
          </div>

          {/* Right Controls */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              style={{
                padding: '0.4rem', borderRadius: 'var(--radius-md)',
                background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>

            {/* User pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.3rem 0.75rem 0.3rem 0.4rem',
              background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ padding: '0.25rem', background: 'var(--primary-200)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)' }}>
                <User size={13} />
              </div>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user?.username || 'User'}
              </span>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.375rem 0.875rem',
                background: 'var(--error-bg)', border: '1px solid var(--error-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--error)', cursor: 'pointer',
                fontSize: '0.8125rem', fontWeight: 600,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--error)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--error-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--error)'; }}
            >
              <LogOut size={15} />
              Logout
            </motion.button>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button onClick={toggleTheme} style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-secondary)', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)', background: 'var(--surface-secondary)', border: '1px solid var(--border-primary)', cursor: 'pointer', color: 'var(--text-primary)' }}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
              style={{ overflow: 'hidden', borderTop: '1px solid var(--border-secondary)' }}
            >
              <div style={{ padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {filteredNavItems.map((item, idx) => (
                  <motion.div
                    key={item.path}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem', fontWeight: isActivePath(item.path) ? 600 : 400,
                        color: isActivePath(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: isActivePath(item.path) ? 'var(--surface-secondary)' : 'transparent',
                        textDecoration: 'none', border: isActivePath(item.path) ? '1px solid var(--border-primary)' : '1px solid transparent',
                      }}
                    >
                      <span style={{ opacity: 0.7 }}>{item.icon}</span>
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-secondary)', marginTop: '0.25rem', display: 'flex', gap: '0.5rem' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'var(--surface-secondary)', borderRadius: 'var(--radius-md)' }}>
                    <User size={15} style={{ color: 'var(--text-accent)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.username || 'User'}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{ padding: '0.5rem 0.875rem', background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--radius-md)', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 600 }}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
