# Giant Slug Naming Standard (슬러그 명명 규칙 문서)

**작성일:** 2026-08-09  
**적용 대상:** 라이브 493인 및 신규 추가 400여 인물 전체  

---

## 1. 기본 원칙
모든 인물의 `slug`는 **영문 위키백과(English Wikipedia) 정식 표제어를 Kebab-Case(소문자 하이픈 연결)로 변환한 문자열**을 표준 1순위 소스로 사용한다.

---

## 2. 세부 분류 규칙

### A. 통상 단일어/대표명 (Mononym / Common Name)
역사적·국제적으로 성 또는 이름 하나로 통용되는 세계적 대가에 대해서는 단일 토큰 슬러그를 유지한다.
- **예시:** `beethoven`, `mozart`, `chaucer`, `goethe`, `machiavelli`, `copernicus`, `zoroaster`, `ibn-sina`, `ibn-rushd`

### B. 일반 풀네임 (Full Name)
단일어로 통용되지 않는 대부분의 역사적 인물은 영문 풀네임(Kebab-case)을 사용한다.
- **예시:** `rene-descartes`, `benjamin-franklin`, `pyotr-ilyich-tchaikovsky`, `mustafa-kemal-ataturk`, `elizabeth-i`

### C. 한국 역사 인물 (Korean Figures)
왕/군주는 `king-` 또는 `gwanggaeto-the-great` 등 통용 영문 표기를 사용하며, 일반 인물은 국립국어원 로마자 표기법 또는 위키백과 공식 표기(McCune-Reischauer 등)를 사용한다.
- **예시:** `king-sejong`, `king-jeongjo`, `gwanggaeto-the-great`, `yi-sun-shin`, `yu-gwan-sun`, `ahn-jung-geun`

### D. 중동 및 이슬람 권역 인물 (Middle Eastern Figures)
이슬람 골든 에이지 사상가는 서구권 통용 별칭이 아닌 본명 통용어(`ibn-`) 또는 위키백과 표준 표제어를 사용하며, 중복 생성된 껍데기 슬러그(예: `averroes-ibn-rushd`, `avicenna-ibn-sina`)는 사용을 금지하고 정본 슬러그로 301 리다이렉트한다.

---

## 3. 중복 및 변경 시 처리
기존에 발급되어 Google 검색엔진에 색인된 슬러그를 정본 슬러그로 통합할 때는 반드시 **HTTP 301 영구 리다이렉트**를 `next.config.mjs`에 등록하여 SEO 지수를 보존한다.
