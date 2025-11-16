"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, TranslationKey, t as getTranslation, getDefaultLocale, getSupportedLocales } from '../lib/i18n';

interface LanguageContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  isRTL: boolean;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>(getDefaultLocale());

  useEffect(() => {
    const initLanguage = () => {
      // Get language from localStorage or browser preference
      const savedLanguage = localStorage.getItem('language') as Locale;
      let selectedLanguage: Locale = getDefaultLocale();

      if (savedLanguage && getSupportedLocales().includes(savedLanguage)) {
        selectedLanguage = savedLanguage;
      } else {
        // Detect browser language
        const browserLanguage = navigator.language.toLowerCase();
        if (browserLanguage.startsWith('ar')) {
          selectedLanguage = 'ar';
        }
      }

      setLanguageState(selectedLanguage);

      // Update document direction and language
      document.documentElement.dir = selectedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = selectedLanguage;
    };

    initLanguage();
  }, []);

  const setLanguage = (newLanguage: Locale) => {
    setLanguageState(newLanguage);
    localStorage.setItem('language', newLanguage);

    // Update document direction and language
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const isRTL = language === 'ar';

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    isRTL,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}