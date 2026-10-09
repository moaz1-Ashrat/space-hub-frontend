// src/components/shared/Navbar.tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import {
  LogOut,
  Menu,
  LayoutDashboard,
  User,
  Search,
  Home as HomeIcon,
  Info,
  Mail,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useLanguageStore } from '../../stores/languageStore';
import apiClient from '../../lib/axios';

interface NavbarProps {
  onMenuClick?: () => void;
}

const publicLinks = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/spaces', label: 'Spaces', icon: Search },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
];

export function Navbar({ onMenuClick }: NavbarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {}
    clearAuth();
    navigate('/login');
  };

  const dashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'space_owner') return '/owner';
    return '/customer';
  };

  const profilePath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin/settings';
    if (user.role === 'space_owner') return '/owner';
    return '/customer/profile';
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80 sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between h-16 gap-3">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-2">
          {isAuthenticated && onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          )}

          <Link
            to={isAuthenticated ? dashboardPath() : '/'}
            className="flex items-center gap-2 shrink-0 group"
            title={isAuthenticated ? 'Dashboard' : 'Home'}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-heading font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hidden sm:inline">
              {t('appName', 'Space Hub')}
            </span>
          </Link>
        </div>

        {/* Center: Public Links */}
        <div className="hidden lg:flex items-center gap-1">
          {publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {link.label}
              {isActive(link.to) && (
                <motion.div
                  layoutId="navbar-active"
                  className="absolute inset-x-2 -bottom-px h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-secondary text-white hover:opacity-90 transition-opacity shrink-0"
            title="Toggle language"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted transition-colors shrink-0"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {isAuthenticated && user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:inline text-sm font-medium truncate max-w-24">
                  {user.name}
                </span>
                <ChevronDown
                  className={`hidden md:inline size-3.5 transition-transform ${
                    userMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute end-0 mt-2 w-56 rounded-lg border border-border bg-surface shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-border bg-muted/30">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <div className="p-1">
                      <Link
                        to={dashboardPath()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="size-4" />
                        Dashboard
                      </Link>
                      <Link
                        to={profilePath()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                      >
                        <User className="size-4" />
                        Profile
                      </Link>
                    </div>

                    <div className="p-1 border-t border-border">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="size-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}