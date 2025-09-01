// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // If there's no session and the user isn't on the login or public pages,
  // redirect them to the login page.
  if (!sessionCookie && pathname !== '/login' && pathname !== '/signup' && pathname !== '/') {
    return NextResponse.redirect(
      new URL(`/login?next=${pathname}`, request.url)
    );
  }

  // Allow the request to continue if authenticated or if it's a public page.
  return NextResponse.next();
}

// The matcher defines which routes the middleware will run on.
// This is an optimized way to protect specific paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - public (public folder)
     * - And your public pages like /, /login, /signup
     */
    '/((?!_next/static|_next/image|favicon.ico|api|public|login|signup|forgotpassword|reset-password).*)',
  ],
};