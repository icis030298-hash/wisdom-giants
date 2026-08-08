# AI_CONTEXT.md - 프로젝트 기술적 맥락 및 아키텍처 가이드

이 문서는 AI 에이전트가 `list_dir`이나 불필요한 검색 없이 프로젝트의 핵심 구조와 아키텍처를 빠르게 파악하여, 프롬프트 토큰을 절약하고 프롬프트 캐싱(Prompt Caching) 히트율을 높일 수 있도록 돕는 맥락 마스터 파일입니다.

---

## 1. 프로젝트 개요 (Core Stack)
- **Framework**: Next.js 15 (App Router 기반)
- **Internationalization**: `next-intl`을 이용한 24개 국 다국어 라우팅
- **Backend / Database**: Supabase (SSR Auth 및 PostgreSQL)
- **CSS**: Vanilla CSS & TailwindCSS (필요시 부분 적용)
- **Deployment**: Vercel
- **SEO & Indexing**: 24개 언어 완주 (4,680개 블로그 포스트 완비, sitemap 16,488개 URL / blog.xml 4,704개 URL 실측 확인)

---

## 2. 프로젝트 폴더 구조 및 핵심 파일
- `src/app/[locale]/`: 다국어 라우트 폴더 (24개 로케일 지원)
  - `giant/[slug]/page.tsx`: 각 거인의 상세 페이지 렌더링 파일.
  - `blog/[slug]/page.tsx`: 블로그 포스트 상세 페이지.
- `src/middleware.ts`: 호스트네임 리다이렉트(WWW), 로케일 자동 리다이렉트, Supabase SSR 세션 갱신을 담당하는 미들웨어.
- `src/components/brand-mark.tsx`: 파비콘, 헤더, 푸터 전체에 통일 적용된 로마 주화 카메오 심볼 단일 소스.
- `src/data/blog-posts.ts`: 24개 로케일 번역을 포함하는 전체 블로그 포스트 데이터베이스.
- `src/data/narratives/*.json`: 거인별 내러티브 데이터 (`epic_<locale>` 필드 포함).

---

## 3. 현황 및 최신 상태 (2026-08-08 기준)
1. **블로그 및 로케일 SEO 완전화**:
   - 24개 언어 × 195편 = 총 4,680편 완비 (미번역 0건).
   - 프로덕션 Sitemap 16,488개 URL / blog.xml 4,704개 URL 색인 지원.
2. **브랜드 아이덴티티 통일**:
   - 파비콘(`/icon`), 헤더 로고, 푸터 로고 심볼을 `BrandMark` 단일 소스로 통합 완료.
3. **감사 및 데이터 무결성 검증**:
   - `scripts/site-audit.js`를 이용한 정적 및 런타임 SEO 감사 체계 가동.

---

## 4. 토큰 절약을 위한 AI 작동 지침
- **순서 준수**: 항상 `AI_CONTEXT.md` -> `GEMINI.md` 순으로 캐싱에 등록합니다.
- **최소 읽기**: 작업 영역을 명확히 하고, 관련된 소스 파일 이외의 파일은 읽지 않습니다.
- **실측 기반 검증**: 데이터 및 SEO 상태 판단 시 추측하지 않고 `scripts/site-audit.js` 또는 실제 파일 검증을 우선 수행합니다.
