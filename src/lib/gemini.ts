'use server';

import { getVertexAIInstance } from './vertexai';
import { GEMINI_MODELS } from './models';
import { checkRateLimit, clientIdFrom, noteProviderRejection, providerRetryAfter, isProviderRateLimit } from './rate-limit';
import { apiError } from './api-errors';
import { headers } from 'next/headers';
import { buildGiantSystemPrompt, toGeminiHistory } from './giant-prompt';

/**
 * 사용자님께서 검증하신 2.5 버전 모델을 사용하는 서버 액션 함수입니다.
 */
export async function getGiantResponse(giantSlug: string, persona: string, message: string, giantName: string, history: any[] = [], locale: string = 'ko', problemId?: string, customText?: string) {

  // This server action, not /api/chat, is what the chat UI actually calls, so
  // the limit has to live here. Returning the message as normal text keeps the
  // caller unchanged — it renders whatever string comes back.
  const verdict = checkRateLimit(clientIdFrom(await headers()))
  if (!verdict.ok) {
    return apiError(verdict.scope === 'global' ? 'busy' : 'tooFast', locale)
  }

  // Prompt construction lives in giant-prompt.ts so /api/app/chat can share it.
  const sysPrompt = buildGiantSystemPrompt({ giantSlug, persona, message, giantName, history, locale, problemId, customText });

  // Try Gemini models for stability and speed
  const modelsToTry = GEMINI_MODELS;
  
  const vAI = getVertexAIInstance();
  let lastError = null;

  for (const modelId of modelsToTry) {
    try {
      const model = vAI.getGenerativeModel({ 
        model: modelId,
        systemInstruction: {
          parts: [{ text: sysPrompt }]
        }
      });

      const chatHistory = toGeminiHistory(history);

      const chatSession = model.startChat({
        history: chatHistory,
      });

      const result = await chatSession.sendMessage(message);
      const response = await result.response;
      
      // Fallback helper to extract text safely from Vertex AI response
      if (typeof response.text === 'function') {
        return response.text();
      } else {
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
        throw new Error("Could not extract text from Vertex AI response object");
      }

    } catch (error: any) {
      lastError = error;
      console.warn(`[Gemini Error]: Failed utilizing model [${modelId}]`, error.message);
        const m = error.message || String(error);
        if (isProviderRateLimit(m)) noteProviderRejection(providerRetryAfter(m));
      continue;
    }
  }

  console.error("[Gemini 2.5 Critical Error] All 2.5 models failed. Details:", {
    message: lastError?.message,
    giant: giantName
  });
  throw new Error(lastError?.message || "I encountered an error while retrieving my wisdom from the Gemini 2.5 engine.");
}
