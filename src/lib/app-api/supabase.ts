import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`[app-api] missing env ${name}`);
  return v;
}

/**
 * Service-role client. Bypasses RLS — the only thing allowed to write
 * profiles / daily_usage / subscriptions. Server-side only; never import from
 * a client component.
 */
export function createAdminClient(): SupabaseClient {
  return createClient(env('NEXT_PUBLIC_SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/**
 * Resolve the user behind `Authorization: Bearer <supabase access_token>`.
 * The app has no cookies, so the @supabase/ssr cookie client used by the web
 * middleware does not apply here; getUser(jwt) verifies the token against the
 * Auth server (signature + expiry + not revoked), which is what we want.
 * Returns null for a missing, malformed, expired or revoked token.
 */
export async function getUserFromRequest(req: Request): Promise<User | null> {
  const header = req.headers.get('authorization') ?? '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = match[1].trim();
  if (!token) return null;

  const anon = createClient(env('NEXT_PUBLIC_SUPABASE_URL'), env('NEXT_PUBLIC_SUPABASE_ANON_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { data, error } = await anon.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
