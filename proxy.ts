/**
 * Next.js Middleware for Supabase Auth
 */

import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

/** Routes that don't require authentication */
const PUBLIC_ROUTES = [
  '/',
  '/submit',
  '/podcasts',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
  '/auth/verify',
];

/** Route prefixes that are public (anything under these paths) */
const PUBLIC_ROUTE_PREFIXES_EXACT = [
  '/podcasts/',
];

/** Route prefixes that don't require authentication */
const PUBLIC_PREFIXES = [
  '/api/submit',
  '/api/public/',
  '/_next/',
  '/favicon.ico',
];

/** Where to redirect unauthenticated users */
const LOGIN_ROUTE = '/auth/login';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public prefixes (static files, API routes, etc.)
  if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  // If Supabase is not configured with real credentials, skip auth checks
  // but still protect /admin by redirecting to login
  if (!supabaseUrl || !supabaseAnonKey ||
    supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder')) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  const isPublicRoute =
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_ROUTE_PREFIXES_EXACT.some(p => pathname.startsWith(p));
  const isAuthRoute = pathname.startsWith('/auth/');

  if (!user && !isPublicRoute) {
    const redirectUrl = new URL(LOGIN_ROUTE, request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute && !pathname.includes('callback')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
