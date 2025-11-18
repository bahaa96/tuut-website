# Dynamic Locale Generation from Countries Database

This system dynamically generates locale codes based on countries stored in the Supabase database. Instead of hardcoding supported locales, it fetches countries and creates locale codes in the format `en-COUNTRY_CODE` and `ar-COUNTRY_CODE`.

## Overview

The system supports:
- **8 countries**: Egypt, Jordan, KSA, Kuwait, Morocco, Oman, Qatar, UAE
- **2 languages**: English (`en`) and Arabic (`ar`)
- **16 total locales**: 2 languages × 8 countries
- **Dynamic generation**: Locales are generated based on database content
- **Automatic middleware integration**: Ready to use with Next.js middleware

## Generated Locales

Based on the current countries in the database:

### English Locales
- `en-EG` - Egypt (EGP)
- `en-JO` - Jordan (JOD)
- `en-SA` - KSA (SAR)
- `en-KW` - Kuwait (KWD)
- `en-MA` - Morocco (MAD)
- `en-OM` - Oman (OMR)
- `en-QA` - Qatar (QAR)
- `en-AE` - UAE (AED)

### Arabic Locales
- `ar-EG` - مصر (ج.م)
- `ar-JO` - الأردن (د.أ)
- `ar-SA` - السعودية (﷼)
- `ar-KW` - الكويت (د.ك)
- `ar-MA` - المغرب (د.م)
- `ar-OM` - عمان (ر.ع)
- `ar-QA` - قطر (ر.ق)
- `ar-AE` - الإمارات (د.إ)

## Files Created

### 1. `utils/localeHelpers.ts`
Core utilities for locale generation and management:

- `generateSupportedLocales()` - Main function to fetch countries and generate locales
- `formatLocalesForMiddleware()` - Format locales for Next.js middleware
- `createCountryToLocaleMapping()` - Create mapping between countries and locale codes
- Helper functions for parsing and validating locales

### 2. `scripts/generate-locales.ts`
Test script to demonstrate locale generation:

```bash
npx tsx scripts/generate-locales.ts
```

### 3. `middleware-dynamic.ts`
Example middleware implementation with dynamic locale support.

## Usage Examples

### Basic Usage

```typescript
import { generateSupportedLocales, formatLocalesForMiddleware } from './utils/localeHelpers';

// Generate locales from database
const { locales, localeData, countries } = await generateSupportedLocales();

// Format for middleware
const { supportedLocales, defaultLocale } = formatLocalesForMiddleware(locales);

console.log('Supported locales:', supportedLocales);
// Output: ['en-EG', 'ar-EG', 'en-AE', 'en-JO', ...]
console.log('Default locale:', defaultLocale);
// Output: 'en-EG'
```

### Country to Locale Mapping

```typescript
import { createCountryToLocaleMapping } from './utils/localeHelpers';

const mapping = createCountryToLocaleMapping(localeData);
console.log(mapping);
// Output: { EG: { en: 'en-EG', ar: 'ar-EG' }, JO: { en: 'en-JO', ar: 'ar-JO' }, ... }
```

### Locale Parsing

```typescript
import { getLanguageFromLocale, getCountryCodeFromLocale, getCountryFromLocale } from './utils/localeHelpers';

const locale = 'ar-SA';
const language = getLanguageFromLocale(locale); // 'ar'
const countryCode = getCountryCodeFromLocale(locale); // 'SA'
const country = getCountryFromLocale(locale, localeData); // Country object for Saudi Arabia
```

## Database Schema

The `countries` table structure:

```sql
CREATE TABLE countries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT UNIQUE NOT NULL,           -- e.g., 'egypt', 'ksa'
  slug TEXT UNIQUE NOT NULL,            -- e.g., 'EG', 'SA'
  name_en TEXT,                         -- e.g., 'Egypt', 'KSA'
  name_ar TEXT,                         -- e.g., 'مصر', 'السعودية'
  currency_code_en TEXT,                -- e.g., 'EGP', 'SAR'
  currency_code_ar TEXT,                -- e.g., 'ج.م', '﷼'
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

## Integration with Next.js

### 1. Update Middleware

Replace your current `middleware.ts` with the dynamic version or update the hardcoded locales:

```typescript
// middleware.ts
import { generateSupportedLocales, formatLocalesForMiddleware } from './utils/localeHelpers'

// Generate supported locales dynamically
const { supportedLocales, defaultLocale } = await generateSupportedLocales()
  .then(({ locales }) => formatLocalesForMiddleware(locales));
```

### 2. Update i18n Configuration

```typescript
// lib/i18n.ts
import { generateSupportedLocales } from './utils/localeHelpers'

export async function getSupportedLocales() {
  const { locales } = await generateSupportedLocales();
  return locales;
}
```

### 3. Build-time Generation (Optional)

For better performance, you can generate locales at build time:

```typescript
// scripts/build-locales.ts
import { generateSupportedLocales, formatLocalesForMiddleware } from '../utils/localeHelpers';
import { writeFileSync } from 'fs';

async function buildLocales() {
  const { locales } = await generateSupportedLocales();
  const { supportedLocales, defaultLocale } = formatLocalesForMiddleware(locales);

  writeFileSync(
    './locales.json',
    JSON.stringify({ supportedLocales, defaultLocale }, null, 2)
  );
}

buildLocales();
```

## Advantages

1. **Dynamic**: Automatically updates when new countries are added to the database
2. **Consistent**: Ensures all locales follow the same pattern
3. **Type-safe**: Full TypeScript support with proper interfaces
4. **Maintainable**: Single source of truth for locale information
5. **Extensible**: Easy to add more languages or modify the format

## Performance Considerations

- The current implementation fetches countries from the database on each request
- For production, consider caching the results or generating at build time
- The database query is lightweight and countries table is small (8 rows)

## Future Enhancements

1. **Caching**: Implement Redis or in-memory caching for better performance
2. **Build-time generation**: Generate locale configuration during build
3. **Additional languages**: Easy to add more languages (fr, es, etc.)
4. **Regional variants**: Support for specific regional formatting
5. **Dynamic loading**: Load locales on-demand based on user geography

## Testing

Run the test script to verify the functionality:

```bash
npx tsx scripts/generate-locales.ts
```

This will:
- Connect to the database
- Fetch all countries
- Generate locale codes
- Display formatted results
- Show configuration examples