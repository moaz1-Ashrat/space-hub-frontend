import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../stores/languageStore';

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { i18n } = useTranslation();
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    // Sync store → i18n
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    // Update document attributes
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language, i18n]);

  return <>{children}</>;
}