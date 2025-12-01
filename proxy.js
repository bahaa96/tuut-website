import { NextResponse } from 'next/server';
import { paraglideMiddleware } from './src/paraglide/server.js';

export function proxy(request) {
  return paraglideMiddleware(request, ({ request, locale }) => {
    // Process request with locale
    return NextResponse.next();
  });
}

export const config = {
  matcher: ['/((?!api|_next|_static|favicon.ico).*)']
};