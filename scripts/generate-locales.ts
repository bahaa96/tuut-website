#!/usr/bin/env tsx

/**
 * Script to generate locale codes based on countries in the Supabase database
 * This script demonstrates how to use the localeHelpers utilities
 */

import { generateSupportedLocales, formatLocalesForMiddleware, createCountryToLocaleMapping } from '../utils/localeHelpers';

async function main() {
  console.log('🌍 Generating locales from countries database...\n');

  try {
    // Generate supported locales from countries
    const { locales, localeData, countries } = await generateSupportedLocales();

    console.log('📊 Countries found in database:');
    countries.forEach((country, index) => {
      console.log(`  ${index + 1}. ${country.name_en} (${country.name_ar}) - Slug: ${country.slug} - Currency: ${country.currency_code_en}/${country.currency_code_ar}`);
    });

    console.log('\n🔤 Generated locale codes:');
    locales.forEach((locale, index) => {
      const localeInfo = localeData.find(l => l.code === locale);
      console.log(`  ${index + 1}. ${locale} - ${localeInfo?.displayName}`);
    });

    // Format for Next.js middleware
    const { supportedLocales, defaultLocale } = formatLocalesForMiddleware(locales);
    console.log('\n⚙️  Formatted for Next.js middleware:');
    console.log(`  Default locale: ${defaultLocale}`);
    console.log(`  Supported locales: [${supportedLocales.join(', ')}]`);

    // Create country to locale mapping
    const countryMapping = createCountryToLocaleMapping(localeData);
    console.log('\n🗂️  Country to locale mapping:');
    Object.entries(countryMapping).forEach(([countrySlug, locales]) => {
      console.log(`  ${countrySlug}: en=${locales.en}, ar=${locales.ar}`);
    });

    // Generate middleware configuration snippet
    console.log('\n📋 Middleware configuration snippet:');
    console.log('// Add this to your middleware.ts file');
    console.log(`const supportedLocales = [${supportedLocales.map(l => `'${l}'`).join(', ')}];`);
    console.log(`const defaultLocale = '${defaultLocale}';`);

    // Generate i18n configuration snippet
    console.log('\n🌐 i18n configuration snippet:');
    console.log('// Add this to your i18n configuration');
    console.log('export const supportedLocales = [');
    supportedLocales.forEach(locale => {
      const localeInfo = localeData.find(l => l.code === locale);
      console.log(`  { code: '${locale}', name: '${localeInfo?.displayName}' },`);
    });
    console.log('];');

    console.log('\n✅ Locale generation completed successfully!');

  } catch (error) {
    console.error('❌ Error generating locales:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}