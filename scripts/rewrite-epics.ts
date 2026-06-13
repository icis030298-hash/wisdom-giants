import { getVertexAIInstance } from "../src/lib/vertexai.js";
import fs from 'fs';
import path from 'path';

// ✅ Vertex AI만 사용 (유료 결제 없음)
// GCP_PROJECT_ID 불필요 - getVertexAIInstance()가 google-service-account.json 자동 로드

const NAPOLEON_QUALITY_STANDARD = `
[품질 기준 - 나폴레옹 서사시 스타일 참고]

나폴레옹 도입부 예시:
"지중해의 폭풍우 치는 물결을 넘어, 새롭게 프랑스의 품에 안긴 코르시카의 험준한 땅 위에서, 고대 충성의 꺼져가는 불씨와 혁명의 불타는 서곡 속에서 한 영혼이 단련되었다."

핵심 특징:
1. 첫 문장부터 시대적 배경을 감각적으로 묘사
2. 독자를 즉시 그 시대 공간으로 끌어들임  
3. 인물의 내면 고독과 갈등을 직접 느끼게 함 (설명 금지)
4. 마크다운 헤더(###, ##, #) 절대 없음 - 단락으로만 구분
5. "~했습니다" 반복 최소화, 현재형·과거형 혼용
6. 정확히 4개 단락, 각 180~280자
7. 절망과 희망, 고통과 성취의 드라마틱한 대비
8. 마지막 단락은 그의 유산이 현재까지 살아있음을 느끼게 마무리
`;

const LOCALE_PROMPTS: Record<string, string> = {
  ko: '한국어로, 문학적 산문 스타일로 (현대 한국 문학 수준)',
  en: 'In English, in literary prose style (epic, dramatic, immersive)',
  de: 'Auf Deutsch, im literarischen Prosa-Stil (episch, dramatisch)',
  ja: '日本語で、文学的な散文スタイルで（叙事詩的、劇的）',
  es: 'En español, en estilo de prosa literaria épica y dramática',
  fr: 'En français, dans un style de prose littéraire épique',
  it: 'In italiano, in stile prosa letteraria epica e drammatica',
  pt: 'Em português, em estilo de prosa literária épica',
  ar: 'باللغة العربية، بأسلوب النثر الأدبي الملحمي والدرامي',
  hi: 'हिंदी में, साहित्यिक महाकाव्य गद्य शैली में',
  ru: 'На русском языке, в стиле литературной эпической прозы',
  zh: '用中文，以史诗般的文学散文风格（戏剧性、引人入胜）'
};

async function generateEpic(
  slug: string,
  giantName: string,
  existingEpicKo: string,
  locale: string
): Promise<string> {
  const vAI = getVertexAIInstance();
  const model = vAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const localeInstruction = LOCALE_PROMPTS[locale] || LOCALE_PROMPTS.en;

  // 기존 서사시에서 핵심 사실만 추출 (마크다운 헤더 제거)
  const cleanExisting = existingEpicKo
    .replace(/^#{1,3}\s.*$/gm, '') // 헤더 제거
    .replace(/\n{3,}/g, '\n\n')    // 과도한 줄바꿈 정리
    .trim()
    .slice(0, 1000);

  const prompt = `당신은 세계 최고 수준의 역사 문학 작가입니다.
역사 위인의 서사시를 재작성하세요.

위인: ${giantName} (slug: ${slug})
언어: ${localeInstruction}

${NAPOLEON_QUALITY_STANDARD}

기존 서사시 (사실 참고용 - 이것보다 훨씬 훌륭하게 재작성):
${cleanExisting}

필수 규칙:
- 마크다운 헤더(#, ##, ###) 절대 사용 금지
- 단락 구분은 빈 줄(\\n\\n)로만
- 정확히 4개 단락
- 각 단락 180~280자
- 첫 문장은 시대와 장소를 감각적으로 묘사
- 인물의 내면 감정과 고독을 독자가 직접 느끼게 표현
- 교과서식 설명("~했습니다" 반복) 최소화
- 마지막 단락: 현재까지 살아있는 유산으로 마무리

서사시 본문 4개 단락만 출력. 제목이나 부연 설명 없이.`;

  const result = await model.generateContent(prompt);
  return result.response.candidates![0].content.parts[0].text!.trim();
}

async function main() {
  console.log('=== 서사시 품질 재작성 시작 (Vertex AI Only) ===\n');

  // 품질 보고서 로드
  const report = JSON.parse(
    fs.readFileSync('scripts/epic-quality-report.json', 'utf8')
  );

  // narratives 로드
  const narrativesPath = 'src/data/final-narratives.json';
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

  // 처리 순서: 심각 → 보통
  const PRIORITY_FIRST = ['yun-dong-ju', 'ibn-khaldun', 'marco-polo', 'edward-jenner', 'george-eliot'];

  const allSlugs = [
    ...report.critical.map((i: any) => i.slug),
    ...report.medium.map((i: any) => i.slug)
  ];

  const ordered = [
    ...PRIORITY_FIRST.filter(s => allSlugs.includes(s)),
    ...allSlugs.filter(s => !PRIORITY_FIRST.includes(s))
  ];

  const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'];

  // CLI 인수로 시작 인덱스 지정 가능 (재시작용)
  const startIdx = parseInt(process.argv[2] || '0', 10);
  const endIdx = parseInt(process.argv[3] || String(ordered.length), 10);

  console.log(`처리 대상: ${ordered.length}명 (인덱스 ${startIdx}~${endIdx - 1})`);
  console.log(`예상 API 호출: ${(endIdx - startIdx) * 12}회\n`);

  let success = 0;
  let failed = 0;
  let saved = 0;

  for (let i = startIdx; i < Math.min(endIdx, ordered.length); i++) {
    const slug = ordered[i];
    const n = narratives[slug];
    if (!n) {
      console.log(`[SKIP] ${slug} - 데이터 없음`);
      continue;
    }

    const existingKo = n.epic_ko || n.epic?.ko || '';
    const giantName = slug.replace(/-/g, ' ');

    console.log(`\n[${i + 1}/${ordered.length}] 재작성: ${slug}`);

    for (const locale of LOCALES) {
      process.stdout.write(`  ${locale}...`);
      try {
        const newEpic = await generateEpic(slug, giantName, existingKo, locale);

        // 검증
        const hasHeader = /^#{1,3}\s/m.test(newEpic);
        const paragraphs = newEpic.split(/\n\n+/).filter(p => p.trim().length > 50);

        if (hasHeader) {
          console.log(` ⚠️ 헤더 감지됨 - 후처리 정리`);
          narratives[slug][`epic_${locale}`] = newEpic
            .replace(/^#{1,3}\s.*$/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
        } else {
          narratives[slug][`epic_${locale}`] = newEpic;
        }

        console.log(` ✅ ${newEpic.length}자 / ${paragraphs.length}단락`);
        success++;
      } catch (e: any) {
        console.log(` ❌ ${e.message?.slice(0, 60)}`);
        failed++;
      }

      // Rate limit 방지 (2초 대기)
      await new Promise(r => setTimeout(r, 2000));
    }

    saved++;
    // 5명마다 중간 저장
    if (saved % 5 === 0) {
      fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf-8');
      console.log(`\n💾 중간 저장 완료 (${saved}명 처리)`);
    }
  }

  // 최종 저장
  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf-8');

  console.log('\n=== 완료 ===');
  console.log(`성공: ${success}회`);
  console.log(`실패: ${failed}회`);
  console.log(`처리 위인: ${saved}명`);
  console.log('\n다음 단계:');
  console.log('  npm run build');
  console.log('  git add . && git commit -m "feat: rewrite epics to Napoleon-level quality"');
}

main().catch(console.error);
