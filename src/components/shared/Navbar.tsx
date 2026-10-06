import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, Menu, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useLanguageStore } from '../../stores/languageStore';
import apiClient from '../../lib/axios';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors
    }
    clearAuth();
    navigate('/login');
  };

  const dashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'space_owner') return '/owner';
    return '/customer';
  };

  return (
    <nav className="border-b border-border bg-surface sticky top-0 z-30">
      <div className="container mx-auto flex items-center justify-between h-16 gap-3">
        {/* Left: Logo + Mobile Menu */}
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

          {/* Logo: Goes to Dashboard when authenticated, Home when not */}
          <Link
            to={isAuthenticated ? dashboardPath() : '/'}
            className="text-xl font-heading font-bold text-primary shrink-0 hover:opacity-90 transition-opacity"
            title={isAuthenticated ? 'Go to Dashboard' : 'Home'}
          >
            {t('appName')}
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-secondary text-white hover:opacity-90 transition-opacity shrink-0"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted transition-colors shrink-0"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {isAuthenticated && user ? (
            <>
              {/* Dashboard Button (visible on md+) */}
              <Link
                to={dashboardPath()}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
                title="Go to Dashboard"
              >
                <LayoutDashboard className="size-3.5" />
                <span className="hidden lg:inline">Dashboard</span>
              </Link>

              {/* User Name */}
              <Link
                to={dashboardPath()}
                className="hidden sm:inline px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted transition-colors truncate max-w-32"
                title={user.name}
              >
                {user.name}
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-md text-error hover:bg-error/10 transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="size-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}