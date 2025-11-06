// Helper functions to extract country data from the database schema

interface Country {
  id: string;
  label: {
    ar: string;
    en: string;
  };
  value: string;
  image_url: string;
  currency_code: {
    ar: string;
    en: string;
  };
  currency: {
    ar: string;
    en: string;
  };
}

export function getCountryName(country: Country | null, language: 'en' | 'ar' = 'en'): string {
  if (!country) return language === 'en' ? 'Country' : 'دولة';
  
  return country.label[language] || (language === 'en' ? 'Country' : 'دولة');
}

export function getCountryValue(country: Country | null): string {
  if (!country) return '';
  return country.value || '';
}

export function getCountryImage(country: Country | null): string {
  if (!country) return '';
  return country.image_url || '';
}

export function getCountryId(country: Country | null): string {
  if (!country) return '';
  return country.id || '';
}

export function getCurrencyCode(country: Country | null, language: 'en' | 'ar' = 'en'): string {
  if (!country) return '';
  return country.currency_code[language] || '';
}

export function getCurrencyName(country: Country | null, language: 'en' | 'ar' = 'en'): string {
  if (!country) return '';
  return country.currency[language] || '';
}

// For backwards compatibility - this was used in Header component
export function getCountryEmoji(country: Country | null): string {
  // Since we have image_url instead of emoji, we'll return empty string
  // and the component should use the image_url instead
  return '';
}
