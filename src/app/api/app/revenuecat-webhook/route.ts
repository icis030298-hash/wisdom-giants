import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { createAdminClient } from '@/lib/app-api/supabase';
import { jsonError } from '@/lib/app-api/responses';
import { PREMIUM_ENTITLEMENT } from '@/lib/app-api/quota';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const HANDLED_EVENTS = new Set(['INITIAL_PURCHASE', 'RENEWAL', 'CANCELLATION', 'EXPIRATION']);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * The value RevenueCat sends is whatever was typed into the dashboard's
 * "Authorization header value" field. Accept it verbatim or as `Bearer <secret>`
 * so the dashboard entry can be either form.
 */
function authorized(header: string | null, secret: string): boolean {
  if (!header) return false;
  const candidates = [header, header.replace(/^Bearer\s+/i, '')];
  return candidates.some((c) => {
    const a = Buffer.from(c);
    const b = Buffer.from(secret);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

/**
 * POST /api/app/revenuecat-webhook
 * Handles INITIAL_PURCHASE / RENEWAL / CANCELLATION / EXPIRATION only; every
 * other event type is acknowledged (200) and ignored so RevenueCat stops
 * retrying. `app_user_id` == Supabase user id (the app calls Purchases.logIn(user.id)).
 */
export async function POST(req: Request) {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[revenuecat-webhook] REVENUECAT_WEBHOOK_SECRET is not set');
    return jsonError(500, 'NOT_CONFIGURED');
  }
  if (!authorized(req.headers.get('authorization'), secret)) {
    return jsonError(401, 'UNAUTHORIZED');
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return jsonError(400, 'BAD_REQUEST');
  }

  const event = payload?.event;
  const type: string = event?.type ?? '';
  if (!HANDLED_EVENTS.has(type)) {
    return NextResponse.json({ ok: true, ignored: type || 'unknown' });
  }

  // Prefer the current id; fall back to the original one for aliased users.
  const appUserId: string | undefined = [event?.app_user_id, event?.original_app_user_id].find(
    (id) => typeof id === 'string' && UUID_RE.test(id)
  );
  if (!appUserId) {
    // Anonymous RevenueCat ids ($RCAnonymousID:…) cannot be mapped to a user.
    console.warn('[revenuecat-webhook] no Supabase-shaped app_user_id on event', type, event?.app_user_id);
    return NextResponse.json({ ok: true, ignored: 'no_user' });
  }

  const entitlementIds: string[] = Array.isArray(event?.entitlement_ids) ? event.entitlement_ids : [];
  const hasPremium = entitlementIds.length === 0 || entitlementIds.includes(PREMIUM_ENTITLEMENT);
  const expiresAt: string | null =
    typeof event?.expiration_at_ms === 'number' ? new Date(event.expiration_at_ms).toISOString() : null;

  let entitlement: string | null;
  switch (type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
      entitlement = hasPremium ? PREMIUM_ENTITLEMENT : null;
      break;
    case 'CANCELLATION':
      // Auto-renew turned off; access continues until expires_at. Keep the
      // entitlement and let the expiry date decide (isSubscribed checks it).
      entitlement = hasPremium ? PREMIUM_ENTITLEMENT : null;
      break;
    case 'EXPIRATION':
    default:
      entitlement = null;
      break;
  }

  const row = {
    user_id: appUserId,
    rc_app_user_id: String(event?.app_user_id ?? appUserId),
    entitlement,
    expires_at: type === 'EXPIRATION' && !expiresAt ? new Date().toISOString() : expiresAt,
    updated_at: new Date().toISOString(),
  };

  const { error } = await createAdminClient().from('subscriptions').upsert(row, { onConflict: 'user_id' });
  if (error) {
    console.error('[revenuecat-webhook] upsert failed', error.message);
    return jsonError(500, 'INTERNAL');
  }

  return NextResponse.json({ ok: true, type, user_id: appUserId, entitlement, expires_at: row.expires_at });
}
