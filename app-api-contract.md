# 앱 전용 API 계약 (`/api/app/*`)

앱(`src/lib/api.ts`)이 기대하는 요청/응답 형태. 서버(웹 저장소 Part A)는 이 문서에 맞춰 구현하고, 바뀌면 양쪽을 함께 고친다.

공통
- 인증: `Authorization: Bearer <supabase access_token>`. 없거나 무효 → `401 { "code": "AUTH_REQUIRED" }`
- 날짜 기준 KST. 무료 5건 + 광고 보너스(최대 2) / 구독자 200건.
- 에러 본문은 항상 `{ "code": string, ... }`.

## GET /api/app/quota
```json
{ "subscribed": false, "remaining": 3, "limit": 6, "adBonusLeft": 1 }
```
- `remaining`: 오늘 남은 건수(무료+보너스, 구독자는 200 상한 기준). `limit`: 오늘의 상한(5+보너스 또는 200).

## POST /api/app/chat
요청
```json
{ "slug": "socrates", "message": "…", "locale": "ko",
  "history": [ { "role": "user", "text": "…" }, { "role": "model", "text": "…" } ] }
```
- 한도 초과 시 스트림 시작 전에 `402 { "code": "QUOTA_EXCEEDED", "remaining": 0, "adBonusLeft": 1 }`
- 성공 시 `Content-Type: text/event-stream`. 각 이벤트는 `data: <JSON>\n\n`:
  - `{ "text": "…" }` 증분 텍스트
  - `{ "done": true, "remaining": 2, "adBonusLeft": 1 }` 마지막 프레임 — 카운트 차감은 Gemini 성공 후
  - `{ "error": "…" }` 중간 실패(차감 없음)
  - `data: [DONE]`은 무시됨

## POST /api/app/ad-bonus
본문 `{}` → 성공 시 quota와 같은 형태. `ad_bonus_count >= 2`면 `409 { "code": "AD_BONUS_EXHAUSTED" }`.

## POST /api/app/account-delete
본문 `{}` → `{ "ok": true }`. auth.users + profiles/daily_usage/subscriptions 삭제.

## POST /api/app/revenuecat-webhook
앱은 호출하지 않음(RevenueCat → 서버). `Authorization` 헤더 = `REVENUECAT_WEBHOOK_SECRET`. RevenueCat `app_user_id`는 Supabase `user.id`와 같다(앱이 `Purchases.logIn(user.id)`로 맞춤).

## 서버 구현 메모 (Part A, 2026-08-29)
- 추가 에러 코드: `400 { code: "BAD_REQUEST", reason }`(slug/message 누락, 2,000자 초과, JSON 아님) · `404 { code: "GIANT_NOT_FOUND" }` · `429 { code: "RATE_LIMITED", retryAfter }`(+ `Retry-After` 헤더, 분당 4건/사용자 버스트 가드) · `500 { code: "INTERNAL" }`
- `history`는 최근 40개만 사용. Gemini가 user→model 교대를 요구하므로 연속 같은 역할은 서버가 정리함.
- 웹훅 `Authorization`은 시크릿 원문 또는 `Bearer <secret>` 둘 다 허용.
- 구독자가 `/ad-bonus`를 호출하면 409가 아니라 현재 quota를 그대로 돌려줌(no-op).
