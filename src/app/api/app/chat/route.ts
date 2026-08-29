import { getVertexAIInstance } from '@/lib/vertexai';
import { GEMINI_MODELS } from '@/lib/models';
import { buildGiantSystemPrompt, toGeminiHistory } from '@/lib/giant-prompt';
import { checkRateLimit, isProviderRateLimit, noteProviderRejection, providerRetryAfter } from '@/lib/rate-limit';
import { giantsData } from '@/data/giants';
import { createAdminClient, getUserFromRequest } from '@/lib/app-api/supabase';
import { authRequired, jsonError } from '@/lib/app-api/responses';
import { computeQuota, getQuota, recordChat } from '@/lib/app-api/quota';
import { localizedGiantName } from '@/lib/app-api/giant-name';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_MESSAGE_CHARS = 2000;
const MAX_HISTORY = 40;

type AppHistoryEntry = { role: 'user' | 'model'; text: string };

/**
 * POST /api/app/chat — app-only, authenticated, quota-enforced, streaming.
 *
 * Order matters and is fixed by the work order:
 *   1. Bearer JWT → user           (401 AUTH_REQUIRED)
 *   2. subscription / daily usage  (402 QUOTA_EXCEEDED before any stream byte)
 *   3. shared provider rate limit  (429 RATE_LIMITED)
 *   4. Gemini stream (SSE)         — same persona prompt as the web chat
 *   5. count the message ONLY after the model answered; failures cost nothing.
 *
 * Wire format (app-api-contract.md): `data: {"text"}` chunks, then
 * `data: {"done":true,"remaining","adBonusLeft"}`; `data: {"error"}` on a
 * mid-stream failure (no deduction).
 */
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) return authRequired();

  let body: any;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, 'BAD_REQUEST', { reason: 'invalid JSON' });
  }

  const slug = typeof body?.slug === 'string' ? body.slug : '';
  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  const locale = typeof body?.locale === 'string' && /^[a-z]{2}$/.test(body.locale) ? body.locale : 'ko';
  const rawHistory: unknown = Array.isArray(body?.history) ? body.history : [];

  if (!slug || !message) return jsonError(400, 'BAD_REQUEST', { reason: 'slug and message are required' });
  if (message.length > MAX_MESSAGE_CHARS) return jsonError(400, 'BAD_REQUEST', { reason: 'message too long' });

  const giant = giantsData.find((g) => g.slug === slug);
  if (!giant) return jsonError(404, 'GIANT_NOT_FOUND');

  const admin = createAdminClient();

  let quota;
  try {
    quota = await getQuota(admin, user.id);
  } catch (e: any) {
    console.error('[api/app/chat] quota read', e?.message ?? e);
    return jsonError(500, 'INTERNAL');
  }
  if (quota.remaining <= 0) {
    return jsonError(402, 'QUOTA_EXCEEDED', { remaining: 0, adBonusLeft: quota.adBonusLeft });
  }

  // The daily quota is the business rule; this is the burst guard for the
  // shared Gemini pool, keyed by user rather than IP because we know who it is.
  const rl = checkRateLimit(`u:${user.id}`);
  if (!rl.ok) {
    return jsonError(429, 'RATE_LIMITED', { retryAfter: rl.retryAfter }, { 'Retry-After': String(rl.retryAfter) });
  }

  // App history is { role, text }; the prompt builder and Gemini expect { role, content }.
  const history = (rawHistory as any[])
    .filter((m): m is AppHistoryEntry => m && (m.role === 'user' || m.role === 'model') && typeof m.text === 'string')
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.text }));

  const giantName = localizedGiantName(slug, locale, giant.name);
  const sysPrompt = buildGiantSystemPrompt({
    giantSlug: slug,
    persona: giant.persona,
    message,
    giantName,
    history,
    locale,
  });
  const chatHistory = toGeminiHistory(history);

  const encoder = new TextEncoder();
  const vAI = getVertexAIInstance();
  const subscribed = quota.subscribed;
  const userId = user.id;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (frame: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(frame)}\n\n`));
      };
      const finish = () => {
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      let lastError: any = null;

      for (const modelId of GEMINI_MODELS) {
        let emitted = false;
        try {
          const model = vAI.getGenerativeModel({
            model: modelId,
            systemInstruction: { parts: [{ text: sysPrompt }] },
          });
          const session = model.startChat({ history: chatHistory });
          const result = await session.sendMessageStream(message);

          for await (const chunk of result.stream) {
            let text = '';
            try {
              text = typeof chunk.text === 'function' ? chunk.text() : '';
            } catch {
              text = chunk?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? '').join('') ?? '';
            }
            if (text) {
              emitted = true;
              send({ text });
            }
          }

          if (!emitted) throw new Error(`empty response from ${modelId}`);

          // Success → this is the one place the counter moves.
          let remaining = quota.remaining - 1;
          let adBonusLeft = quota.adBonusLeft;
          try {
            const usage = await recordChat(admin, userId);
            const q = computeQuota(subscribed, usage);
            remaining = q.remaining;
            adBonusLeft = q.adBonusLeft;
          } catch (e: any) {
            // The user already has their answer; don't turn a bookkeeping
            // failure into a visible error. Log loudly — it means a free message.
            console.error('[api/app/chat] recordChat failed after success', e?.message ?? e);
          }
          send({ done: true, remaining, adBonusLeft });
          finish();
          return;
        } catch (error: any) {
          lastError = error;
          const m = error?.message || String(error);
          console.warn(`[api/app/chat] model ${modelId} failed:`, m);
          if (isProviderRateLimit(m)) noteProviderRejection(providerRetryAfter(m));

          if (emitted) {
            // Text already reached the client; switching models now would
            // produce a spliced answer. Report and stop — nothing is deducted.
            send({ error: 'stream interrupted' });
            finish();
            return;
          }
          continue;
        }
      }

      console.error('[api/app/chat] all models failed', { giant: slug, message: lastError?.message });
      send({ error: lastError?.message || 'all models failed' });
      finish();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
