import { NextResponse } from "next/server";

export function proxy(request) {
  const url = request.nextUrl;
  let pathname = url.pathname;

  // Exclude sitemap, robots.txt, site.webmanifest, and assets from locale country redirect
  if (
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap.xml/" ||
    pathname.startsWith("/sitemap.xml/") ||
    pathname === "/robots.txt" ||
    pathname === "/robots.txt/" ||
    pathname.startsWith("/robots.txt/") ||
    pathname === "/site.webmanifest" ||
    pathname === "/site.webmanifest/" ||
    pathname.startsWith("/site.webmanifest/") ||
    pathname.startsWith("/assets/")
  ) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", request.nextUrl.pathname);
    response.headers.set("x-paraglide-request-url", request.url);
    return response;
  }

  // Remove trailing slash for consistent matching, but preserve it for the redirect
  const originalPathname = pathname;
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  // Check if pathname already has a localeCountry (format: /xx-XX/...)
  const localeCountryMatch = pathname.match(/^\/([a-z]{2}-[A-Z]{2})(\/.*)?$/);
  const localeCountryFromUrl = localeCountryMatch
    ? localeCountryMatch[1]
    : null;

  // Get localeCountry from cookie
  const localeCountryFromCookie = request.cookies.get("localeCountry")?.value;

  // If URL has a localeCountry, save it to cookie and continue
  if (localeCountryFromUrl) {
    const response = NextResponse.next();
    response.headers.set("x-pathname", request.nextUrl.pathname);

    const locale = localeCountryFromUrl.split("-")[0];
    response.headers.set("x-paraglide-locale", locale);
    response.headers.set("x-paraglide-request-url", request.url);

    // Save localeCountry to cookie if it's different from the one in cookie
    if (localeCountryFromCookie !== localeCountryFromUrl) {
      response.cookies.set("localeCountry", localeCountryFromUrl, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        sameSite: "lax",
      });
    }

    return response;
  }

  // No localeCountry in URL - need to redirect
  let targetLocaleCountry = localeCountryFromCookie || "ar-SA";

  // Build redirect URL
  const redirectPath = `/${targetLocaleCountry}${
    originalPathname === "/" ? "" : originalPathname
  }`;
  const newUrl = new URL(redirectPath, request.url);
  if (url.search) {
    newUrl.search = url.search;
  }

  // Create redirect response
  const response = NextResponse.redirect(newUrl);

  // Save localeCountry to cookie if it wasn't already set
  if (!localeCountryFromCookie) {
    response.cookies.set("localeCountry", targetLocaleCountry, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_static|favicon.ico|sitemap.xml|robots.txt|site.webmanifest|assets).*)"],
};
