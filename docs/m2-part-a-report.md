# M2 Part A 완료 보고 — 앱 전용 API (웹 저장소)

작성 2026-08-29 · 지시서: `작업지시-M2.md` Part A · 계약: `app-api-contract.md`

## 구현 내역

| 항목 | 파일 | 상태 |
|---|---|---|
| Supabase 스키마 | `supabase/migrations/20260829000000_app_quota.sql` | 작성 완료 · **미적용** (아래 블로커) |
| 인증·서비스롤·KST·쿼터 공용 모듈 | `src/lib/app-api/{supabase,quota,kst,responses,giant-name}.ts` | 완료 |
| `POST /api/app/chat` (SSE) | `src/app/api/app/chat/route.ts` | 완료 |
| `POST /api/app/ad-bonus` | `src/app/api/app/ad-bonus/route.ts` | 완료 (SSV는 TODO 주석) |
| `GET /api/app/quota` | `src/app/api/app/quota/route.ts` | 완료 |
| `POST /api/app/revenuecat-webhook` | `src/app/api/app/revenuecat-webhook/route.ts` | 완료 (4종 이벤트만) |
| `POST /api/app/account-delete` | `src/app/api/app/account-delete/route.ts` | 완료 |
| 웹 삭제 안내 페이지 | `src/app/[locale]/delete-account/page.tsx` + `messages/{ko,en}.json` `DeleteAccount` | 완료 (나머지 22개 언어는 en 폴백) |
| 페르소나 프롬프트 공유 | `src/lib/giant-prompt.ts` (gemini.ts에서 **원문 그대로** 분리) | 완료 — 520줄 verbatim 이동 검증 |

`.env.local`에 `REVENUECAT_WEBHOOK_SECRET`(랜덤 48hex) 추가. `SUPABASE_SERVICE_ROLE_KEY`는 이미 있었음. 둘 다 gitignore 대상.

### 설계 결정
- **차감 시점**: 스트림 시작 전에는 읽기만으로 한도 검사(402), Gemini 응답이 끝난 뒤에만 `app_increment_chat` RPC로 원자적 +1. 실패한 호출은 절대 차감되지 않음. 동시 요청 2건이 마지막 1건을 두고 경합하면 최대 1건 초과 허용될 수 있음(허용 오차).
- **JWT 검증**: 앱은 쿠키가 없으므로 `@supabase/ssr` 쿠키 클라이언트 대신 `supabase-js`의 `auth.getUser(jwt)`로 Auth 서버 검증(서명·만료·폐기). 지시서의 "ssr 서버 클라이언트"에서 이 부분만 의도적으로 바꿈.
- **KST**: `kstDate()` 하나로 통일(+9h 고정, DST 없음). 15:00 UTC 경계 테스트 통과.
- **RLS**: 세 테이블 모두 본인 행 select만, 쓰기 정책 없음(service role만). 증가 함수는 `security definer` + `search_path=''`, `anon/authenticated`에서 execute 회수.
- **웹훅**: CANCELLATION은 자동갱신 해지이므로 entitlement 유지·`expires_at`로 만료 판단, EXPIRATION만 entitlement null. `$RCAnonymousID:` 등 UUID가 아닌 app_user_id는 200으로 무시.
- **위인 이름**: `messages/<locale>.json`의 `Giants.<slug>.name`(웹 헤더와 동일 소스), 없으면 로스터의 한글 이름.

## 검증 결과 (로컬 dev, port 3111)

| 검증 항목 | 결과 |
|---|---|
| 인증 없는 요청 → 401 `AUTH_REQUIRED` (quota/chat/ad-bonus/account-delete) | ✅ |
| 잘못된 JWT → 401 | ✅ |
| 웹훅 헤더 없음/불일치 → 401 `UNAUTHORIZED` | ✅ |
| 웹훅 시크릿 일치 + 미처리 타입/익명 ID → 200 ignored | ✅ |
| `/ko`,`/en`,`/ja(=en 폴백)/delete-account` → 200 | ✅ |
| 기존 웹 `/api/chat` 회귀 | ✅ 200, 나폴레옹 정상 응답 |
| 프롬프트 분리 후 텍스트 동일성 | ✅ 이동한 520줄 전부 verbatim 일치 |
| `tsc --noEmit` | ✅ 29건 → 29건(기존 오류 동일, 신규 0) |
| 쿼터 산식(5/5+1/5+2/구독 200) · KST 자정 경계 | ✅ 단위 검증 |
| **5건 소진 후 402 · ad-bonus 3회째 409 · 계정 삭제 실동작** | ⛔ **DB 미연결로 실행 불가** (아래) |

## ⛔ 블로커: Supabase 프로젝트 호스트가 존재하지 않음

`.env.local`의 `NEXT_PUBLIC_SUPABASE_URL`(`yrqageqpxzltprtuvnpl.supabase.co`)이 **DNS에서 Non-existent domain**입니다(로컬 리졸버·8.8.8.8 모두). Google API 등 다른 호스트는 정상 해석되므로 네트워크 문제가 아니라 **프로젝트가 삭제됐거나(무료 플랜 장기 일시정지 후 삭제 포함) 레퍼런스가 잘못된 것**입니다.

영향:
1. 마이그레이션을 적용할 대상이 없음 → 대표님이 Supabase 대시보드에서 프로젝트 상태 확인 후 URL/anon/service_role 키를 새로 발급해 `.env.local`과 Vercel env에 넣어야 합니다. 앱 저장소 `.env`도 같은 값으로.
2. 웹의 `middleware.ts`가 매 페이지 요청마다 이 호스트로 `getUser()`를 호출하고 있는데 조용히 실패 중(에러를 반환할 뿐 throw는 안 함). 웹은 사실상 Supabase 없이 돌고 있었음.

적용 방법(프로젝트가 살아나면): 대시보드 SQL Editor에 `supabase/migrations/20260829000000_app_quota.sql` 붙여넣기, 또는 `npx supabase link --project-ref <ref>` 후 `npx supabase db push`. 마이그레이션은 `if not exists`/`drop … if exists`로 재실행 안전.

## 보고 사항

### 1. 웹 Firebase/Supabase 이중 인증 실사용 현황
- **실제 세션을 만드는 쪽은 Firebase**입니다. `login-modal.tsx`(signInWithPopup) → `auth-button.tsx`, `chat-interface.tsx`, `chats/page.tsx`가 모두 `@/lib/firebase`의 `auth`/`db`(Firestore 대화 이력)를 사용.
- Supabase는 `middleware.ts`(`updateSession`)와 `app/auth/callback`(PKCE 코드 교환)만 참조하며, 이 콜백으로 보내는 로그인 UI가 웹에 없음. 즉 Supabase 세션은 생성 경로 자체가 없고, 지금은 호스트도 사라진 상태.
- 앱은 Supabase Auth만 쓰므로 **웹 계정과 앱 계정은 현재 별개**입니다. 통일은 별도 결정(지시서대로 미착수).

### 2. RevenueCat · AdMob 콘솔에서 대표님이 입력할 값
**RevenueCat**
- 프로젝트 생성 → iOS/Android 앱 등록 (App Store Shared Secret, Play 서비스계정 JSON)
- Products: `gw_yearly`(₩49,000), `gw_monthly`(₩6,900) — 스토어 콘솔에 동일 ID로 먼저 등록
- Entitlement: `premium` ← 두 상품 연결 · Offering: default에 둘 다
- Webhook: URL `https://www.giantswisdom.com/api/app/revenuecat-webhook`, Authorization header value = `.env.local`의 `REVENUECAT_WEBHOOK_SECRET` 값(Vercel env에도 동일하게)
- 앱에 넣을 값: iOS/Android Public API Key(앱 저장소 `.env`)
**AdMob**
- 계정·앱 등록 후 App ID(iOS/Android) → 앱 `app.json`, 보상형 광고 단위 ID 2개 → 앱 `.env`
- SSV는 이번 범위 밖(서버 `ad-bonus`에 TODO). 상한 2회라 남용 한도 명확.
**Supabase Auth**(앱 로그인용)
- Google/Apple provider 활성화, Redirect URL에 앱 스킴 추가(앱 보고서 참조)

### 3. 무료 5건 기준 Gemini 비용 실측 (gemini-3.5-flash-lite, 2026-08-29 실호출)

| 케이스 | 입력 토큰 | 출력 토큰 | 소요 | 비용/건 |
|---|---|---|---|---|
| 첫 인사(ko, 이력 없음) | 749 | 51 | 1.2s | $0.00035 |
| 장문 고민(ko, 이력 4턴) | 710 | 521 | 3.5s | $0.00152 |
| 첫 질문(en, 소크라테스) | 628 | 23 | 0.9s | $0.00025 |

단가(공식 pricing 페이지): 3.5-flash-lite 입력 $0.30/1M · 출력 $2.50/1M.
- 건당 평균 **≈ $0.001 (≈ ₩1.4)**, 장문 답변 쪽이 상한. 이력 40턴이 쌓이면 입력 +2~4k 토큰 → 건당 +$0.001 정도.
- **무료 사용자 1명 = 최대 7건/일 ≈ ₩10/일, 매일 쓰면 ≈ ₩300/월.** 구독자 상한 200건/일은 최악 ₩280/일이지만 실사용은 훨씬 아래.
- 참고: 출력 단가가 2.5-flash-lite($0.40)의 6배. 단위경제가 빡빡해지면 폴백 순서를 바꾸는 것이 가장 큰 레버.

## 다음 단계
1. (대표) Supabase 프로젝트 확인/재생성 → 키 3종 교체 → 마이그레이션 적용
2. (웹 세션) DB 연결 후 미검증 3항목(402/409/계정 삭제) 실행 + SSE 스트림 실측
3. (앱 세션) 계약 문서에 추가된 400/404/429 코드 처리 반영 후 E2E
