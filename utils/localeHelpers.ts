import { fetchCountries } from '../lib/supabase-fetch';

export interface Country {
  id: string;
  value: string;
  slug: string;
  name_en: string;
  name_ar: string;
  currency_code_en: string;
  currency_code_ar: string;
}

export interface LocaleData {
  code: string;
  language: 'en' | 'ar';
  country: Country;
  displayName: string;
}

/**
 * Fetches countries from the database and generates locale codes
 * Returns both English and Arabic locales for each country
 */
export async function generateSupportedLocales(): Promise<{
  locales: string[];
  localeData: LocaleData[];
  countries: Country[];
}> {
  // Fetch countries from Supabase
  const { data: countries, error } = await fetchCountries();

  if (error) {
    console.error('Error fetching countries:', error);
    return {
      locales: ['en-EG', 'ar-EG'], // Fallback to Egypt
      localeData: [],
      countries: []
    };
  }

  if (!countries || countries.length === 0) {
    console.warn('No countries found in database');
    return {
      locales: ['en-EG', 'ar-EG'], // Fallback to Egypt
      localeData: [],
      countries: []
    };
  }

  // Transform the countries data to match our interface
  const transformedCountries: Country[] = countries.map((country: any) => ({
    id: country.id,
    value: country.value,
    slug: country.slug,
    name_en: country.name_en || country.name,
    name_ar: country.name_ar,
    currency_code_en: country.currency_code_en,
    currency_code_ar: country.currency_code_ar
  }));

  // Generate locale codes for each country
  const locales: string[] = [];
  const localeData: LocaleData[] = [];

  transformedCountries.forEach((country) => {
    // English locale
    const enLocale = `en-${country.slug}`;
    locales.push(enLocale);
    localeData.push({
      code: enLocale,
      language: 'en',
      country,
      displayName: `${country.name_en} (${country.currency_code_en})`
    });

    // Arabic locale
    const arLocale = `ar-${country.slug}`;
    locales.push(arLocale);
    localeData.push({
      code: arLocale,
      language: 'ar',
      country,
      displayName: `${country.name_ar} (${country.currency_code_ar})`
    });
  });

  return {
    locales,
    localeData,
    countries: transformedCountries
  };
}

/**
 * Gets country-specific locale codes for a specific language
 */
export function getLanguageSpecificLocales(localeData: LocaleData[], language: 'en' | 'ar'): string[] {
  return localeData
    .filter(locale => locale.language === language)
    .map(locale => locale.code);
}

/**
 * Gets country information from a locale code
 */
export function getCountryFromLocale(localeCode: string, localeData: LocaleData[]): Country | null {
  const localeInfo = localeData.find(locale => locale.code === localeCode);
  return localeInfo?.country || null;
}

/**
 * Extracts language from locale code
 */
export function getLanguageFromLocale(localeCode: string): 'en' | 'ar' {
  return localeCode.startsWith('ar-') ? 'ar' : 'en';
}

/**
 * Extracts country code from locale code
 */
export function getCountryCodeFromLocale(localeCode: string): string {
  const parts = localeCode.split('-');
  return parts.length === 2 ? parts[1] : '';
}

/**
 * Validates if a locale code is supported based on our countries data
 */
export function isValidLocale(localeCode: string, supportedLocales: string[]): boolean {
  return supportedLocales.includes(localeCode);
}

/**
 * Formats locale data for Next.js middleware configuration
 */
export function formatLocalesForMiddleware(locales: string[]): {
  supportedLocales: string[];
  defaultLocale: string;
} {
  // Sort locales by preference (English first, then Arabic, Egypt first)
  const sortedLocales = locales.sort((a, b) => {
    const aParts = a.split('-');
    const bParts = b.split('-');

    // Prioritize Egypt (EG)
    if (aParts[1] === 'EG' && bParts[1] !== 'EG') return -1;
    if (bParts[1] === 'EG' && aParts[1] !== 'EG') return 1;

    // Then prioritize English
    if (aParts[0] === 'en' && bParts[0] === 'ar') return -1;
    if (aParts[0] === 'ar' && bParts[0] === 'en') return 1;

    // Then alphabetical by country
    return aParts[1].localeCompare(bParts[1]);
  });

  return {
    supportedLocales: sortedLocales,
    defaultLocale: 'en-EG' // Default to Egypt in English
  };
}

/**
 * Creates a mapping of country slugs to locale codes
 */
export function createCountryToLocaleMapping(localeData: LocaleData[]): Record<string, { en: string; ar: string }> {
  const mapping: Record<string, { en: string; ar: string }> = {};

  localeData.forEach(locale => {
    const countrySlug = locale.country.slug;
    if (!mapping[countrySlug]) {
      mapping[countrySlug] = { en: '', ar: '' };
    }
    mapping[countrySlug][locale.language] = locale.code;
  });

  return mapping;
}