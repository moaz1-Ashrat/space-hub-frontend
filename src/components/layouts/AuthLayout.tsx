import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '../../stores/themeStore';
import { useLanguageStore } from '../../stores/languageStore';

export function AuthLayout() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Bar with Logo + Toggles */}
      <div className="flex justify-between items-center p-4 md:p-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center group-hover:opacity-90 transition-opacity">
            <span className="text-white font-heading font-bold text-lg">S</span>
          </div>
          <span className="text-lg font-heading font-bold text-primary hidden sm:inline">
            {t('appName')}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-secondary text-white hover:opacity-90 transition-opacity"
          >
            {language === 'en' ? 'العربية' : 'English'}
          </button>
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-primary text-white hover:opacity-90 transition-opacity"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="bg-surface border border-border rounded-xl shadow-modal p-6 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}