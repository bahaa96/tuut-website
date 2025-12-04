import { NextResponse } from "next/server";

export function proxy(request) {
  const url = request.nextUrl;
  let pathname = url.pathname;

  // Remove trailing slash for consistent matching, but preserve it for the redirect
  const originalPathname = pathname;
  if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  // Define paths that need localeCountry
  const localizedPaths = ["/deals", "/stores", "/products", "/guides"];

  // Check if the path matches a localized route but doesn't have localeCountry
  const needsLocale = localizedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (needsLocale && !pathname.match(/^\/[a-z]{2}-[A-Z]{2}/)) {
    // Default to Arabic Saudi Arabia
    const defaultLocaleCountry = "ar-SA";

    // Redirect to the same path with localeCountry prefix (preserve original path with trailing slash)
    const newUrl = new URL(
      `/${defaultLocaleCountry}${originalPathname}`,
      request.url
    );
    if (url.search) {
      newUrl.search = url.search;
    }
  }

  const localeCountry = request.nextUrl.pathname.split("/")[1];
  const locale = localeCountry?.split("-")[0];

  const response = NextResponse.next();
  response.headers.set("x-pathname", request.nextUrl.pathname);
  response.headers.set("x-paraglide-locale", locale);
  response.headers.set("x-paraglide-request-url", request.url);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_static|favicon.ico).*)"],
};
