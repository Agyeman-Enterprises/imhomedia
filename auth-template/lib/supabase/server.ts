/**
 * Supabase Server Client
 * USE THIS for all server-side calls (API routes, Server Components, middleware)
 * 
 * @example
 * import { createClient } from '@/auth-template/lib/supabase/server';
 * const supabase = await createClient();
 * const { data: { user } } = await supabase.auth.getUser();
 */

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/** Returns null when Supabase is not yet configured (placeholder creds). */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  if (
    !supabaseUrl || !supabaseAnonKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseAnonKey.includes('placeholder')
  ) {
    return null;
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from Server Component - cookies are read-only
          // This is expected behavior, not an error
        }
      },
    },
  });
}
