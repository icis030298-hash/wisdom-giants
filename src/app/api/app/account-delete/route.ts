import { NextResponse } from 'next/server';
import { createAdminClient, getUserFromRequest } from '@/lib/app-api/supabase';
import { authRequired, jsonError } from '@/lib/app-api/responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/app/account-delete — store-mandated in-app account deletion.
 * Removes the auth user; profiles / daily_usage / subscriptions cascade via
 * FK, but are deleted explicitly first so a missing cascade can never leave
 * orphaned quota or subscription rows behind.
 */
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return authRequired();

  const admin = createAdminClient();
  try {
    for (const table of ['daily_usage', 'subscriptions'] as const) {
      const { error } = await admin.from(table).delete().eq('user_id', user.id);
      if (error) throw new Error(`${table}: ${error.message}`);
    }
    const { error: profileError } = await admin.from('profiles').delete().eq('id', user.id);
    if (profileError) throw new Error(`profiles: ${profileError.message}`);

    const { error: authError } = await admin.auth.admin.deleteUser(user.id);
    if (authError) throw new Error(`auth: ${authError.message}`);

    console.info('[api/app/account-delete] deleted user', user.id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error('[api/app/account-delete]', e?.message ?? e);
    return jsonError(500, 'INTERNAL');
  }
}
