/**
 * Supabase Browser Client
 * USE THIS for all client-side (React component) Supabase calls
 * 
 * @example
 * import { createClient } from '@/auth-template/lib/supabase/client';
 * const supabase = createClient();
 * const { data } = await supabase.from('table').select();
 */

import { createBrowserClient } from '@supabase/ssr';

/** Returns null when Supabase is not yet configured (placeholder creds). */
export function createClient() {
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  if (
    !supabaseUrl || !supabaseAnonKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseAnonKey.includes('placeholder')
  ) {
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
