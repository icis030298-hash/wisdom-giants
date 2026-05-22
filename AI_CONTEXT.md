# AI_CONTEXT.md - 프로젝트 기술적 맥락 및 아키텍처 가이드

이 문서는 AI 에이전트가 `list_dir`이나 불필요한 검색 없이 프로젝트의 핵심 구조와 아키텍처를 빠르게 파악하여, 프롬프트 토큰을 절약하고 프롬프트 캐싱(Prompt Caching) 히트율을 높일 수 있도록 돕는 맥락 마스터 파일입니다.

---

## 1. 프로젝트 개요 (Core Stack)
- **Framework**: Next.js 15 (App Router 기반)
- **Internationalization**: `next-intl`을 이용한 다국어 라우팅
- **Backend / Database**: Supabase (SSR Auth 및 PostgreSQL)
- **CSS**: Vanilla CSS & TailwindCSS (필요시 부분 적용)
- **Deployment**: Vercel

---

## 2. 프로젝트 폴더 구조 및 핵심 파일
- `src/app/[locale]/`: 다국어 라우트 폴더 (`ko`, `en`, `de`, `ja`, `es`, `fr`, `it`, `pt`)
  - `giant/[slug]/page.tsx`: 각 거인의 상세 페이지 렌더링 파일.
  - `components/giant-detail-client.tsx`: 거인 상세 페이지 클라이언트 컴포넌트.
- `src/middleware.ts`: 호스트네임 리다이렉트(WWW), 로케일 자동 리다이렉트, Supabase SSR 세션 갱신을 담당하는 미들웨어.
- `src/utils/supabase/middleware.ts`: Supabase 세션을 갱신하고 쿠키를 설정하는 헬퍼.
- `src/data/final-narratives.json`: 99명(실제 101명 등)의 거인들의 원문 및 다국어 번역 (`_ko`, `_en`, `_es`, `_de`, `_ja`, `_fr`, `_pt`) 데이터가 모두 집약된 핵심 데이터베이스.

---

## 3. 진행 중인 핵심 작업 & 주의사항
1. **다국어 Narrative 번역 및 결합**:
   - German (`de`) 번역: 100% 완료.
   - Japanese (`ja`) 번역: 현재 34번 거인까지 번역 완료 (진행 중).
   - Portuguese (`pt`) 번역: 예정.
   - 번역 시 Gemini API 아웃풋 토큰 한도 초과 오류 방지를 위해, 프롬프트에서 고도로 정제되고 압축된(Dense & Beautifully Concise) 번역 스타일을 요구합니다.
2. **검색 엔진 로봇(Crawler) 500 에러 해결**:
   - Googlebot, Naverbot 등 크롤러가 사이트에 접근 시 Supabase Auth 세션 조회(`/auth/v1/user`)에서 500 에러를 유발하는 문제를 미들웨어 수준에서 감지하여 Supabase Auth 체크를 **우회(Bypass)** 시키는 작업 진행 중.

---

## 4. 토큰 절약을 위한 AI 작동 지침
- **순서 준수**: 항상 `AI_CONTEXT.md` -> `GEMINI.md` 순으로 캐싱에 등록합니다.
- **최소 읽기**: 작업 영역을 명확히 하고, 관련된 소스 파일 이외의 파일은 읽지 않습니다.
