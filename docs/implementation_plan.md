# [Task: 12,000개 다국어 페이지 색인 속도 극대화를 위한 사이트맵 아키텍처 전략]

사장님, 지시하신 Trust & Compliance 아키텍처 리팩토링의 프로덕션 빌드(`npm run build`)가 백그라운드에서 진행 중이며, 곧 라이브 URL 검증(test-spam.js)을 수행할 예정입니다. 이 시간 동안 구글 봇을 미친 듯이 빨아들일 **초고속 색인 사이트맵 전략**을 기획했습니다.

## 🚀 문제 인식
Giants Wisdom은 500명의 위인 × 24개 국어 = **최소 12,000개의 방대한 동적 페이지**를 가지고 있습니다.
이 페이지들을 단일 `sitemap.xml`에 모두 욱여넣으면, 구글 봇의 크롤링 예산(Crawl Budget)을 초과하여 색인이 누락되거나 몇 달이 걸릴 수 있습니다.

## Proposed Changes: 사이트맵 분할 및 인덱싱 가속화

### 1. 언어별 사이트맵 분할 (Locale-based Sitemap Sharding)
- **`sitemap.ts` 동적 라우팅**: Next.js 14의 `generateSitemaps` 기능을 활용하여 단일 사이트맵이 아닌, `sitemap/ko.xml`, `sitemap/en.xml`, `sitemap/de.xml` 등 24개의 다국어 사이트맵으로 분할 생성합니다.
- **사이트맵 인덱스 (Sitemap Index)**: 구글 봇이 24개의 사이트맵을 한 번에 읽어들일 수 있도록 최상단에 마스터 사이트맵 인덱스를 구축합니다.

### 2. 가중치(Priority)와 갱신 주기(ChangeFreq) 최적화
- **`Priority 1.0`**: 홈 메인 페이지 (`/`, `/ko`, `/en` 등)
- **`Priority 0.8`**: DNA 테스트 결과 페이지 및 블로그 인덱스
- **`Priority 0.7`**: 500명의 위인 개별 페이지 (`/ko/giant/albert-einstein`) - `changefreq: weekly` 적용
- **`Priority 0.5`**: About, Privacy, Terms 등 정적 인프라 페이지

### 3. XML과 HTML 교차 검증 (Hreflang)
- 이미 `layout.tsx`에서 구현된 `buildSEOAlternates` (head 태그 내의 alternate 언어 링크)와 분할 사이트맵이 교차 검증을 일으키도록 구성하여, 구글 봇이 "이 사이트는 완벽히 구조화된 다국어 대기업 사이트"라고 인식하게 만듭니다.

### 4. 로봇 배제 표준 (Robots.txt) 최적화
- `robots.txt`에 24개의 분할 사이트맵이 담긴 마스터 사이트맵 주소를 선언합니다.
- `/scratch/`, `/api/` 등 불필요하게 크롤링 예산을 갉아먹는 내부 라우팅은 완벽하게 Disallow 처리합니다.

## User Review Required
> [!IMPORTANT]
> 사장님, 구글 서치 콘솔(GSC)에 이 거대한 사이트맵을 제출한 뒤, 일반적인 핑(Ping) 방식 외에 **Google Indexing API** (GCP 서비스 계정 연동)를 적용하여 12,000개 페이지를 수일 내에 강제 색인시킬지 여부를 결정해주시면 반영하겠습니다. 일반 제출로도 E-E-A-T 구조상 색인은 잘 되겠지만, Indexing API를 쓰면 속도는 폭발적으로 빠릅니다.

위 4단계 사이트맵 분할 전략에 동의하시면 **'Proceed'**를 눌러주십시오. 빌드 테스트가 완료되는 즉시, 라이브 스팸 검증 리포트와 함께 사이트맵 코딩 작업에 돌입하겠습니다!
