import { NextResponse } from 'next/server';
import { createAdminClient, getUserFromRequest } from '@/lib/app-api/supabase';
import { authRequired, jsonError } from '@/lib/app-api/responses';
import { getQuota } from '@/lib/app-api/quota';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET /api/app/quota → { subscribed, remaining, limit, adBonusLeft } */
export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return authRequired();

  try {
    const quota = await getQuota(createAdminClient(), user.id);
    return NextResponse.json(quota, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    console.error('[api/app/quota]', e?.message ?? e);
    return jsonError(500, 'INTERNAL');
  }
}
