import { NextRequest, NextResponse } from 'next/server'

// List of supported locales
const supportedLocales = ['en-EG', 'ar-EG', 'en-US', 'ar-SA']
const defaultLocale = 'en-EG'

function getLocaleFromRequest(request: NextRequest): string {
  // Check for existing locale in path
  const pathname = request.nextUrl.pathname

  // Extract locale from pathname if it exists
  const pathnameParts = pathname.split('/')
  if (pathnameParts.length > 1) {
    const potentialLocale = pathnameParts[1]
    if (supportedLocales.includes(potentialLocale)) {
      return potentialLocale
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

  // Skip if it's already a locale-specific route
  const pathnameParts = pathname.split('/')
  if (pathnameParts.length > 1 && supportedLocales.includes(pathnameParts[1])) {
    return NextResponse.next()
  }

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

  // Get the appropriate locale
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