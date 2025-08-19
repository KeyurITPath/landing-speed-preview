import { NextRequest, NextResponse } from 'next/server';
import { routes } from '@/utils/constants/routes';
import createMiddleware from 'next-intl/middleware';
import { decodeToken } from './utils/helper';
import { USER_ROLE } from '@/utils/constants';

const PUBLIC_ROUTES = Object.values(routes.public);
const AUTH_ROUTES = Object.values(routes.auth);
const PROTECTED_ROUTES = Object.values(routes.private)

function getRedirectUrl(
  decodedToken: any,
  request: NextRequest
): NextResponse | null {
  if (
    (decodedToken?.role === USER_ROLE.CUSTOMER && decodedToken?.is_verified) ||
    decodedToken?.role === USER_ROLE.AUTHOR
  ) {
    return NextResponse.redirect(
      new URL(routes.private.dashboard, request.url)
    );
  }
  if (decodedToken?.role === USER_ROLE.CUSTOMER && !decodedToken?.is_verified) {
    return NextResponse.redirect(new URL(routes.public.home, request.url));
  }
  return null; // no redirect, just continue
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value || ''; // replace 'token' with your cookie name

  const decodedToken = decodeToken(token);

  // Public routes → allow
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  // Auth routes → redirect if already logged in
  if (AUTH_ROUTES.includes(pathname) && decodedToken) {
    const redirect = getRedirectUrl(decodedToken, request);
    return redirect ?? NextResponse.next();
  }

  // Protected routes → redirect if not logged in
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!decodedToken) {
      return NextResponse.redirect(new URL(routes.auth.login, request.url));
    }
    // User is authenticated and on a protected route - allow access
    return NextResponse.next();
  }

  // --- 4. Everything else
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};

export default createMiddleware({
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en',
});
