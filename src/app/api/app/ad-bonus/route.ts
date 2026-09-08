import { NextResponse } from 'next/server';
import { createAdminClient, getUserFromRequest } from '@/lib/app-api/supabase';
import { authRequired, jsonError } from '@/lib/app-api/responses';
import { addAdBonus, computeQuota, getQuota, isSubscribed } from '@/lib/app-api/quota';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/app/ad-bonus — rewarded-ad completion callback.
 * +1 free message, at most twice per KST day. Returns the same shape as /quota.
 *
 * TODO(AdMob SSV): this trusts the client's "ad finished" report. Server-side
 * verification (AdMob SSV callback with signature check against Google's
 * public keys) is deliberately deferred — the daily cap of 2 bounds the abuse.
 */
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return authRequired();

  try {
    const admin = createAdminClient();
    const subscribed = await isSubscribed(admin, user.id);
    if (subscribed) {
      // Subscribers never see ads; a stray call is a no-op, not an error.
      return NextResponse.json(await getQuota(admin, user.id));
    }

    const usage = await addAdBonus(admin, user.id);
    if (!usage) return jsonError(409, 'AD_BONUS_EXHAUSTED');

    return NextResponse.json(computeQuota(false, usage), { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[api/app/ad-bonus]', e?.message ?? e);
    return jsonError(500, 'INTERNAL');
  }
}
