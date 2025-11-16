// Helper functions to extract country data from the database schema

interface Country {
  id: string;
  label?: {
    ar?: string;
    en?: string;
  };
  value?: string;
  image_url?: string;
  currency_code?: {
    ar?: string;
    en?: string;
  };
  currency?: {
    ar?: string;
    en?: string;
  };
  // Allow for other possible field names
  name?: string;
  name_ar?: string;
  name_en?: string;
  title?: string;
  title_ar?: string;
  title_en?: string;
  [key: string]: any; // Allow any other fields
}

export function getCountryName(country: Country | null, language: 'en' | 'ar' = 'en'): string {
  if (!country) return language === 'en' ? 'Country' : 'دولة';

  // Handle the expected database structure with name_en and name_ar
  if (language === 'en' && country.name_en) {
    return country.name_en;
  }

  if (language === 'ar' && country.name_ar) {
    return country.name_ar;
  }

  // Fallback to label object if it exists (for backwards compatibility)
  if (country.label && typeof country.label === 'object' && country.label[language]) {
    return country.label[language];
  }

  // Fallback to other possible name fields
  const fallbackFields = ['name', 'title', 'value', 'slug'];
  for (const field of fallbackFields) {
    if (country[field as keyof Country] && typeof country[field as keyof Country] === 'string') {
      return country[field as keyof Country] as string;
    }
  }

  return language === 'en' ? 'Country' : 'دولة';
}

export function getCountryValue(country: Country | null): string {
  if (!country) return '';
  return country.value || country.id || '';
}

export function getCountryImage(country: Country | null): string {
  if (!country) return '';
  return country.image_url || country.image || country.flag || '';
}

export function getCountryId(country: Country | null): string {
  if (!country) return '';
  return country.id || country.value || '';
}

export function getCurrencyCode(country: Country | null, language: 'en' | 'ar' = 'en'): string {
  if (!country || !country.currency_code) return '';
  return country.currency_code[language] || country.currency_code['en'] || country.currency_code['ar'] || '';
}

export function getCurrencyName(country: Country | null, language: 'en' | 'ar' = 'en'): string {
  if (!country || !country.currency) return '';
  return country.currency[language] || country.currency['en'] || country.currency['ar'] || '';
}

// For backwards compatibility - this was used in Header component
export function getCountryEmoji(country: Country | null): string {
  // Since we have image_url instead of emoji, we'll return empty string
  // and the component should use the image_url instead
  return '';
}
