import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const getApplicationURL = (version: string) => {
  if (version === '1') {
    return '/step/1';
  }
  return '/application/v2/';
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/application') {
    const applicationURL = getApplicationURL(
      process.env.NEXT_PUBLIC_APPLICATION_VERSION ?? '1'
    );
    const newUrl = new URL(applicationURL, request.url);
    // Forward query parameters from the original request
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  // If no redirect is needed, continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
