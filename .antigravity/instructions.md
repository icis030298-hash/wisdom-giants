# Antigravity Agent Behavior Guidelines

This project has strict rules regarding Gemini API usage, prompt token conservation, and context caching. All Antigravity agents, subagents, and automated scripts must strictly adhere to these instructions to prevent token waste, minimize input size, and maximize prompt caching efficiency.

---

## 1. Strict Context Minimalism (컨텍스트 다이어트)
- **Targeted File Reading Only**: When analyzing a specific bug, verifying translations, or editing a file, do NOT read unrelated source files, config files, or layouts. ONLY read the file(s) that are directly relevant to your current sub-task.
- **No Wildcard Scanning**: Avoid reading entire directories recursively unless absolutely necessary.
- **Clean Input Payload**: Do not send heavy structural objects (like the entire 99-giant database) in your prompts if you are only processing a single record. Extract the necessary segment and send only that.

## 2. Optimize for Prompt Caching (프롬프트 캐싱 최적화)
- **Linearize Execution Stream**: To leverage Google's automatic prompt caching (Prompt Caching), avoid spawning dozens of concurrent, independent subagents that constantly query with slightly different contexts. Run repetitive/batch requests sequentially or in a highly unified prompt sequence.
- **Prefix Consistency**: Ensure that system prompts, large context files (like instructions or templates), and reference databases are placed at the **beginning (prefix)** of your prompt. This allows Gemini's caching mechanism to match the prefix and reuse the cached tokens.
- **Large Context Caching**: If you must reference a database that exceeds 32,768 tokens (e.g., the complete `final-narratives.json`), explicitly use the Google Gemini Context Caching API (`GoogleAICacheManager`) rather than passing the raw data in every individual request.

## 3. Strict Code & Asset Selection (코드 사재기 금지)
- **No Unused Code Imports**: Never inject unrelated CSS, configurations, or UI component files into your prompt to solve a simple logic or translation query.
- **Compact Responses**: Configure API requests with strict rules to return only the newly generated/modified keys instead of echoing the entire database.

---

## 4. 한국어 가이드 (행동 강령 요약)

1. **컨텍스트 미니멀리즘 (Strict Context Minimalism)**:
   - 다국어 번역, 검수, 코드 수정 시 프로젝트 전체 소스코드나 무관한 설정 파일(예: Firebase 설정, 전역 레이아웃 등)을 프롬프트 컨텍스트에 절대 포함하지 마십시오.
   - 오직 현재 작업 대상이 되는 단일 파일 및 필요한 데이터만 타겟팅하여 조회하십시오.

2. **프롬프트 캐싱 극대화 (Optimize for Prompt Caching)**:
   - 동일한 대용량 데이터(예: 99명의 거인 전체 번역 데이터)를 여러 번 반복해서 참조해야 하는 경우, 무분별하게 서브 에이전트를 독립 분기하여 병렬로 호출하지 마십시오.
   - 단일 대화 컨텍스트 또는 단일 스크립트 흐름 안에서 순차적(Sequential)으로 처리하여 Google API의 자동/수동 **Prompt Caching** 히트율을 극대화하십시오. (캐시 적중 시 비용 및 할당량이 최대 75~90% 절감됩니다.)

3. **중복 전송 금지 (No Code Hoarding)**:
   - 단 하나의 마이너한 질문을 해결하기 위해 여러 레이아웃이나 무관한 코드를 중복으로 전송하여 인풋 토큰을 낭비하는 행위를 철저히 금지합니다.

4. **단일 레코드 다이어트**:
   - 99명의 거인 중 1명만 번역/검수할 때는 99명 전체의 JSON 데이터를 통째로 넘기는 루프 구조를 배제하고, 오직 해당 거인 1명의 데이터 세그먼트만 잘라내어 API에 넘기십시오.
