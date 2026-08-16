/**
 * Sharing a very small pool of model calls between the people using the site.
 *
 * The provider ceiling is 20 requests per minute across every user, on the
 * free tier, and all four models in the fallback chain draw from the same
 * pool — measured, not assumed: 45 parallel calls returned 44 failures with
 * "limit: 20, model: gemini-2.5-flash-lite, retry in 31.7s".
 *
 * With a pool that small, a per-client cap is not a way of turning users away;
 * it is the only way more than one person can talk at once. One client with a
 * loop takes all 20 and everyone else is locked out for the minute. A cap of
 * four leaves room for four or five simultaneous conversations.
 *
 * The global cap sits just under the provider's, so the site sheds load with
 * its own message and a Retry-After rather than surfacing the provider's 429.
 *
 * Limitation worth knowing: this counts in memory, so on a serverless platform
 * each instance keeps its own tally and the real ceiling is per-instance rather
 * than global. That is enough to stop a single client hammering one instance,
 * which is the case that empties the pool today. Moving the counters to
 * Supabase would make them exact at the cost of a round trip per message; not
 * worth it until traffic makes the difference visible.
 */

/**
 * ⚠ These numbers are per MINUTE. The provider's limit is per DAY.
 *
 * The 429 body says so in a field, not in prose:
 *
 *   quotaId:    GenerateRequestsPerDayPerProjectPerModel-FreeTier
 *   quotaValue: 20
 *
 * so a per-minute limiter cannot enforce it. Eighteen a minute is 1,080 an
 * hour; a 20-per-day budget disappears in the first minute at any per-minute
 * number worth having — even three a minute empties it in seven.
 *
 * What this still buys, and why it ships anyway: one client can no longer take
 * the whole budget in one burst, the provider's own 429 closes the pool instead
 * of being retried into, and the refusal arrives as a sentence in the reader's
 * language with a Retry-After instead of a raw error. Insufficient, not
 * harmful.
 *
 * Enforcing the real ceiling needs a daily counter that survives restarts —
 * Supabase, not this module's memory. Until then this is a stopgap, and the
 * rejection totals below are the measurement that tells you when the daily
 * budget is actually being hit.
 */
const WINDOW_MS = 60_000

/**
 * Per client per minute, by what they are doing.
 *
 * Chat is turn-taking: read a reply, think, answer. Four a minute is more than
 * a person types.
 *
 * A debate is not. Starting one fires a call per speaker per round without the
 * user touching anything — four giants over three rounds is twelve calls — so
 * the chat allowance would cut a debate off in its first round. It gets its own
 * ceiling sized to one full debate.
 */
const PER_CLIENT: Record<Kind, number> = {
  chat: 4,
  debate: 14,
}

export type Kind = 'chat' | 'debate'

/** Just under the provider's 20, so we refuse before they do. */
const GLOBAL = 18

type Bucket = { count: number; resetAt: number }

const clients = new Map<string, Bucket>()
let global: Bucket = { count: 0, resetAt: Date.now() + WINDOW_MS }

/** Rejections since boot, so "traffic grew" can be a number rather than a feeling. */
export const rejections = { client: 0, global: 0, since: Date.now() }

function take(bucket: Bucket, limit: number, now: number): { ok: boolean; retryAfter: number } {
  if (now >= bucket.resetAt) {
    bucket.count = 0
    bucket.resetAt = now + WINDOW_MS
  }
  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count++
  return { ok: true, retryAfter: 0 }
}

export type Verdict =
  | { ok: true }
  | { ok: false; scope: 'client' | 'global'; retryAfter: number }

/**
 * @param clientId a stable-enough identity: session id if there is one, else IP.
 * @param kind 'debate' gets the larger allowance; see PER_CLIENT.
 */
export function checkRateLimit(clientId: string, kind: Kind = 'chat'): Verdict {
  const now = Date.now()

  // Sweep expired client buckets so the map cannot grow without bound on a
  // long-lived instance.
  if (clients.size > 5000) {
    for (const [k, b] of clients) if (now >= b.resetAt) clients.delete(k)
  }

  const bucketKey = kind + ':' + clientId
  let bucket = clients.get(bucketKey)
  if (!bucket) {
    bucket = { count: 0, resetAt: now + WINDOW_MS }
    clients.set(bucketKey, bucket)
  }

  const perClient = take(bucket, PER_CLIENT[kind], now)
  if (!perClient.ok) {
    rejections.client++
    logRejection('client', clientId)
    return { ok: false, scope: 'client', retryAfter: perClient.retryAfter }
  }

  const pool = take(global, GLOBAL, now)
  if (!pool.ok) {
    // The client's slot was already spent above; give it back, since it was the
    // pool that refused, not them.
    bucket.count--
    rejections.global++
    logRejection('global', clientId)
    return { ok: false, scope: 'global', retryAfter: pool.retryAfter }
  }

  return { ok: true }
}

/**
 * Called when the provider itself returns 429.
 *
 * Our global cap is a guess at where their ceiling sits; theirs is the fact.
 * Whenever they refuse, the pool is spent for the rest of the window, so close
 * it here instead of letting the next callers walk into the same wall. Without
 * this, a burst that starts mid-window overshoots: measured 24 requests against
 * a cap of 18 let 18 through, and 14 of those still met the provider's 429
 * because earlier traffic had already eaten the minute.
 */
export function noteProviderRejection(retryAfterSeconds?: number) {
  const now = Date.now()
  global = {
    count: GLOBAL,
    resetAt: now + (retryAfterSeconds ? retryAfterSeconds * 1000 : WINDOW_MS),
  }
  rejections.global++
  console.warn(
    `[rate-limit] provider refused; pool closed for ${Math.ceil((global.resetAt - now) / 1000)}s. ` +
      `totals client=${rejections.client} global=${rejections.global}`
  )
}

/** Pull the retry hint out of a provider error message, if it left one. */
export function providerRetryAfter(message: string): number | undefined {
  const m = message.match(/retry in ([\d.]+)s/i)
  return m ? Math.ceil(parseFloat(m[1])) : undefined
}

/** True when an error from the model call is a quota refusal. */
export function isProviderRateLimit(message: string): boolean {
  return /\b429\b|Too Many Requests|exceeded your current quota/i.test(message)
}

function logRejection(scope: 'client' | 'global', clientId: string) {
  // Global rejections are the interesting number: they mean demand has caught
  // up with the plan, which is the signal for raising the quota.
  console.warn(
    `[rate-limit] refused (${scope}) client=${clientId} ` +
      `totals client=${rejections.client} global=${rejections.global} ` +
      `since=${new Date(rejections.since).toISOString()}`
  )
}

/** Identity for a request: prefer a session cookie, fall back to the edge IP. */
export function clientIdFrom(h: Headers): string {
  const cookie = h.get('cookie') || ''
  const session = cookie.match(/(?:^|;\s*)(?:sb-[^=]*-auth-token|__session)=([^;]+)/)
  if (session) return `s:${session[1].slice(0, 48)}`
  const ip =
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    'unknown'
  return `ip:${ip}`
}
