import { NextRequest, NextResponse } from 'next/server'
import { generateSupportedLocales, formatLocalesForMiddleware } from './utils/localeHelpers'

// Generate supported locales dynamically from database
// In production, you might want to cache this result or generate it at build time
async function getSupportedLocales() {
  const { supportedLocales, defaultLocale } = await generateSupportedLocales()
    .then(({ locales }) => formatLocalesForMiddleware(locales));

  return { supportedLocales, defaultLocale };
}

function normalizeLocale(locale: string): string {
  // Convert lowercase country codes to uppercase (e.g., en-egypt -> en-EG)
  const parts = locale.split('-')
  if (parts.length === 2) {
    const [language, country] = parts
    const normalizedCountry = country.toUpperCase()

    // Map some common country code variations
    const countryMap: { [key: string]: string } = {
      'EGYPT': 'EG',
      'SAUDI': 'SA',
      'USA': 'US',
      'AMERICA': 'US'
    }

    const finalCountry = countryMap[normalizedCountry] || normalizedCountry
    return `${language}-${finalCountry}`
  }
  return locale
}

async function getLocaleFromRequest(request: NextRequest): Promise<{ locale: string; supportedLocales: string[]; defaultLocale: string }> {
  // Get supported locales from database
  const { supportedLocales, defaultLocale } = await getSupportedLocales();

  // Check for existing locale in path
  const pathname = request.nextUrl.pathname

  // Extract locale from pathname if it exists
  const pathnameParts = pathname.split('/')
  if (pathnameParts.length > 1) {
    const potentialLocale = pathnameParts[1]
    const normalizedLocale = normalizeLocale(potentialLocale)
    if (supportedLocales.includes(normalizedLocale)) {
      return { locale: normalizedLocale, supportedLocales, defaultLocale }
    }
  }

  // Try to detect locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')[0]
      .split('-')[0]
      .toLowerCase()

    // Find matching locale by language
    const matchingLocale = supportedLocales.find(locale =>
      locale.startsWith(preferredLocale)
    )

    if (matchingLocale) {
      return { locale: matchingLocale, supportedLocales, defaultLocale }
    }
  }

  // Fallback to default locale
  return { locale: defaultLocale, supportedLocales, defaultLocale }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots.txt') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Get locale information (including supported locales from database)
  const { locale, supportedLocales, defaultLocale } = await getLocaleFromRequest(request);

  // Check if the first path segment is a locale
  const pathnameParts = pathname.split('/')
  if (pathnameParts.length > 1 && pathnameParts[1]) {
    const firstSegment = pathnameParts[1]
    const normalizedLocale = normalizeLocale(firstSegment)

    // If it's a supported locale, continue
    if (supportedLocales.includes(normalizedLocale)) {
      return NextResponse.next()
    }

    // If it looks like a locale (contains hyphen) but isn't supported,
    // remove it and redirect to default locale
    if (firstSegment.includes('-') && firstSegment.split('-').length === 2) {
      // Remove the unsupported locale from path and redirect to default
      const pathWithoutLocale = pathname.split('/').slice(2).join('/')
      const url = request.nextUrl.clone()
      url.pathname = `/${defaultLocale}/${pathWithoutLocale}`

      // Add trailing slash if needed
      if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
        url.pathname += '/'
      }

      return NextResponse.redirect(url)
    }
  }

  // Redirect to locale-specific version
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  // Add trailing slash if needed (based on your config)
  if (!url.pathname.endsWith('/') && !url.pathname.includes('.')) {
    url.pathname += '/'
  }

  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (SEO file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
  ],
}

// For development and testing, you can export the current locales
export async function getCurrentLocales() {
  return getSupportedLocales();
}