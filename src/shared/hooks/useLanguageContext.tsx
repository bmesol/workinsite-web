import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '@/shared/utils/translation';
import type { LanguageCode } from '@/shared/utils/translation';

type LanguageContextType = {
  language: LanguageCode;
  setAppLanguage: (lang: LanguageCode) => void; 
  t: (key: string) => string;
  getFontSize: (size: number) => number;        
};

const DEFAULT_LANGUAGE: LanguageCode = 'en';
const STORAGE_KEY = 'APP_LANGUAGE';

const LanguageContext = createContext<LanguageContextType>({
  language: DEFAULT_LANGUAGE,
  setAppLanguage: () => {},
  t: (key: string) => key,
  getFontSize: (size: number) => size,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguage] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem(STORAGE_KEY);
      if (savedLanguage && savedLanguage in translations) {
        setLanguage(savedLanguage as LanguageCode);
        return;
      }

      const browserLang = navigator.language?.split('-')[0];
      if (browserLang && browserLang in translations) {
        setLanguage(browserLang as LanguageCode);
      }
    } catch (error) {
      // ✅ logger.error → console.error
      console.error('LanguageContext: failed to load language', error);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.lang = language;
  }, [language]);

  // ✅ AsyncStorage.setItem → localStorage.setItem (synchronous, no async needed)
  const setAppLanguage = (lang: LanguageCode) => {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      setLanguage(lang);
    } catch (error) {
      console.error('LanguageContext: failed to save language', error);
    }
  };

  // ✅ Same logic — 3 level fallback
  const t = (key: string): string => {
    return (
      translations[language]?.[key] ||
      translations[DEFAULT_LANGUAGE]?.[key] ||
      key
    );
  };

  // ✅ Tamil font scaling — same as React Native
  const getFontSize = (size: number): number => {
    return language === 'ta' ? size * 0.95 : size;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setAppLanguage,
        t,
        getFontSize,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);