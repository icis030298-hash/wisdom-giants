import type { SupabaseClient } from '@supabase/supabase-js';
import { kstDate } from './kst';

export const FREE_DAILY_LIMIT = 5;
export const AD_BONUS_MAX = 2;
/** "Unlimited" for subscribers, with an internal ceiling so a runaway client cannot burn the budget. */
export const SUBSCRIBER_DAILY_LIMIT = 200;
export const PREMIUM_ENTITLEMENT = 'premium';

export type Usage = { chat_count: number; ad_bonus_count: number };

/** Shape returned by GET /api/app/quota and POST /api/app/ad-bonus. */
export type Quota = {
  subscribed: boolean;
  remaining: number;
  limit: number;
  adBonusLeft: number;
};

const EMPTY_USAGE: Usage = { chat_count: 0, ad_bonus_count: 0 };

export async function isSubscribed(admin: SupabaseClient, userId: string): Promise<boolean> {
  const { data, error } = await admin
    .from('subscriptions')
    .select('entitlement, expires_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw new Error(`[quota] subscriptions read failed: ${error.message}`);
  if (!data || data.entitlement !== PREMIUM_ENTITLEMENT) return false;
  if (!data.expires_at) return true;
  return new Date(data.expires_at).getTime() > Date.now();
}

export async function getUsage(admin: SupabaseClient, userId: string, dateKst = kstDate()): Promise<Usage> {
  const { data, error } = await admin
    .from('daily_usage')
    .select('chat_count, ad_bonus_count')
    .eq('user_id', userId)
    .eq('date_kst', dateKst)
    .maybeSingle();
  if (error) throw new Error(`[quota] daily_usage read failed: ${error.message}`);
  return data ?? EMPTY_USAGE;
}

export function computeQuota(subscribed: boolean, usage: Usage): Quota {
  const adBonusLeft = Math.max(0, AD_BONUS_MAX - usage.ad_bonus_count);
  const limit = subscribed ? SUBSCRIBER_DAILY_LIMIT : FREE_DAILY_LIMIT + usage.ad_bonus_count;
  return {
    subscribed,
    remaining: Math.max(0, limit - usage.chat_count),
    limit,
    adBonusLeft,
  };
}

export async function getQuota(admin: SupabaseClient, userId: string): Promise<Quota> {
  const [subscribed, usage] = await Promise.all([isSubscribed(admin, userId), getUsage(admin, userId)]);
  return computeQuota(subscribed, usage);
}

/**
 * Count one successful chat. Call this only after the model has answered —
 * a failed call must never cost the user a message.
 */
export async function recordChat(admin: SupabaseClient, userId: string): Promise<Usage> {
  const { data, error } = await admin
    .rpc('app_increment_chat', { p_user_id: userId, p_date_kst: kstDate() })
    .single<Usage>();
  if (error) throw new Error(`[quota] app_increment_chat failed: ${error.message}`);
  return data;
}

/** +1 bonus; null when today's two bonuses are already used (enforced in SQL, atomically). */
export async function addAdBonus(admin: SupabaseClient, userId: string): Promise<Usage | null> {
  const { data, error } = await admin
    .rpc('app_add_ad_bonus', { p_user_id: userId, p_date_kst: kstDate() })
    .maybeSingle<Usage>();
  if (error) throw new Error(`[quota] app_add_ad_bonus failed: ${error.message}`);
  return data ?? null;
}
