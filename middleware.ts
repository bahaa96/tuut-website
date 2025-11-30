import { NextRequest, NextResponse } from 'next/server'

// List of supported locales (generated from countries database)
const supportedLocales = ['en-EG', 'ar-EG', 'en-AE', 'en-JO', 'en-KW', 'en-MA', 'en-OM', 'en-QA', 'en-SA', 'ar-AE', 'ar-JO', 'ar-KW', 'ar-MA', 'ar-OM', 'ar-QA', 'ar-SA']
const defaultLocale = 'en-EG'

function normalizeLocale(locale: string): string {
  // Convert lowercase country codes to uppercase (e.g., en-egypt -> en-EG)
  const parts = locale.split('-')
  if (parts.length === 2) {
    const [language, country] = parts
    const normalizedCountry = country.toUpperCase()

    // Map some common country name variations to country codes
    const countryMap: { [key: string]: string } = {
      'EGYPT': 'EG',
      'JORDAN': 'JO',
      'SAUDI': 'SA',
      'SAUDIARABIA': 'SA',
      'KUWAIT': 'KW',
      'MOROCCO': 'MA',
      'OMAN': 'OM',
      'QATAR': 'QA',
      'UAE': 'AE',
      'EMIRATES': 'AE'
    }

    const finalCountry = countryMap[normalizedCountry] || normalizedCountry
    return `${language}-${finalCountry}`
  }
  return locale
}

function getLocaleFromRequest(request: NextRequest): string {
  // Check for existing locale in path
  const pathname = request.nextUrl.pathname

  // Extract locale from pathname if it exists
  const pathnameParts = pathname.split('/')
  if (pathnameParts.length > 1) {
    const potentialLocale = pathnameParts[1]
    const normalizedLocale = normalizeLocale(potentialLocale)
    if (supportedLocales.includes(normalizedLocale)) {
      return normalizedLocale
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
      return matchingLocale
    }
  }

  // Fallback to default locale
  return defaultLocale
}

export function middleware(request: NextRequest) {
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

  // Get the appropriate locale for new paths without locale
  const locale = getLocaleFromRequest(request)

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