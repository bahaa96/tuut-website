import enTranslations from '../messages/en.json';
import arTranslations from '../messages/ar.json';

export type Locale = 'en' | 'ar';
export type TranslationKey = string; // Allow string keys for dot notation

const translations = {
  en: enTranslations,
  ar: arTranslations,
} as const;

export function getTranslation(locale: Locale): typeof enTranslations {
  return translations[locale] || translations.en;
}

export function t(locale: Locale, key: TranslationKey): string {
  const translation = getTranslation(locale);

  // Handle nested keys with dot notation (e.g., 'header.deals')
  const keys = key.split('.');
  let value: any = translation;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}

export function getDefaultLocale(): Locale {
  return 'en';
}

export function getSupportedLocales(): Locale[] {
  return ['en', 'ar'];
}

export function isValidLocale(locale: string): locale is Locale {
  return getSupportedLocales().includes(locale as Locale);
}