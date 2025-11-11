import { NextRequest, NextResponse } from 'next/server';
import { routes } from '@/utils/constants/routes';
import createMiddleware from 'next-intl/middleware';
import { decodeToken } from './utils/helper';

const PUBLIC_ROUTES = Object.values(routes.public);
const AUTH_ROUTES = Object.values(routes.auth);
const PROTECTED_ROUTES = Object.values(routes.private);

const POST_PAYMENT_ALLOWED_ROUTES = [
  routes.public.bundles,
  routes.public.upsale_courses,
  routes.public.complete_profile,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (
    pathname.includes('.ico') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value || '';
  const decodedToken = decodeToken(token);

  const isProfileIncompleted = Boolean(
    request.cookies.get('onboarding_redirection_url')?.value
  );

  if (
    isProfileIncompleted &&
    decodedToken &&
    decodedToken?.is_verified === false &&
    !POST_PAYMENT_ALLOWED_ROUTES.includes(pathname)
  ) {
    return NextResponse.redirect(
      new URL(routes.public.complete_profile, request.url)
    );
  }

  // ✅ Public routes → allow
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  // ✅ Auth routes → redirect if already logged in
  if (AUTH_ROUTES.includes(pathname) && decodedToken) {
    return NextResponse.redirect(
      new URL(routes.private.dashboard, request.url)
    );
  }

  // ✅ Protected routes → block if not logged in
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!decodedToken) {
      return NextResponse.redirect(new URL(routes.auth.login, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};

export default createMiddleware({
  locales: ['en', 'es', 'fr'],
  defaultLocale: 'en',
});
