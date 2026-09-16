import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Header */}
        <h1 className="text-4xl font-heading font-bold text-primary">
          {t('appName')}
        </h1>

        <p className="text-muted text-lg">
          {t('welcome')} ✨
        </p>

        <p className="text-sm text-muted">
          {t('tagline')}
        </p>

        {/* Controls */}
        <div className="flex gap-3 justify-center flex-wrap pt-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="px-5 py-2 rounded-md bg-primary text-white font-medium hover:opacity-90 transition-opacity"
          >
            {isDark ? '☀️ ' + t('light') : '🌙 ' + t('dark')}
          </button>

          <button
            onClick={toggleLanguage}
            className="px-5 py-2 rounded-md bg-secondary text-white font-medium hover:opacity-90 transition-opacity"
          >
            🌐 {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        {/* Info */}
        <div className="pt-6 border-t border-border text-sm text-muted space-y-2">
          <div>
            <span className="font-mono">Language: </span>
            <span className="font-mono">{i18n.language}</span>
          </div>
          <div>
            <span className="font-mono">Direction: </span>
            <span className="font-mono">{i18n.language === 'ar' ? 'rtl' : 'ltr'}</span>
          </div>
          <div>
            <span className="font-mono">Theme: </span>
            <span className="font-mono">{isDark ? 'dark' : 'light'}</span>
          </div>
        </div>

        {/* i18n Test */}
        <div className="pt-4 text-start bg-surface p-4 rounded-lg border border-border space-y-2">
          <p className="font-heading font-semibold">{t('notFound.title')}</p>
          <p className="text-sm text-muted">{t('notFound.message')}</p>
          <button className="text-primary text-sm font-medium hover:underline">
            {t('notFound.goHome')} →
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;