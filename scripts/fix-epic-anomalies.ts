import { getVertexAIInstance } from "../src/lib/vertexai.js";
import fs from 'fs';

const LOCALE_PROMPTS: Record<string, string> = {
  ko: '한국어로, 문학적 산문 스타일로 (현대 한국 문학 수준)',
  es: 'En español, en estilo de prosa literaria épica y dramática',
  ar: 'باللغة العربية، بأسلوب النثر الأدبي الملحمي والدرامي'
};

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

async function generateEpic(
  slug: string,
  locale: string
): Promise<string> {
  const vAI = getVertexAIInstance();
  const model = vAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  const giantName = slug.replace(/-/g, ' ');
  const localeInstruction = LOCALE_PROMPTS[locale] || 'In English';

  const prompt = `당신은 세계 최고 수준의 역사 문학 작가입니다.
역사 위인의 서사시를 재작성하세요.

위인: ${giantName} (slug: ${slug})
언어: ${localeInstruction}

${NAPOLEON_QUALITY_STANDARD}

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

async function fixAnomalies() {
  const narrativesPath = 'src/data/final-narratives.json';
  const narratives = JSON.parse(fs.readFileSync(narrativesPath, 'utf8'));

  const anomalies = [
    { slug: 'miyamoto-musashi', locale: 'es' },
    { slug: 'elizabeth-cady-stanton', locale: 'ko' },
    { slug: 'al-biruni', locale: 'ko' },
    { slug: 'giacomo-puccini', locale: 'ar' }
  ];

  for (const { slug, locale } of anomalies) {
    console.log(`Fixing ${slug} in ${locale}...`);
    try {
      const newEpic = await generateEpic(slug, locale);
      let cleanEpic = newEpic;
      if (/^#{1,3}\s/m.test(cleanEpic)) {
        cleanEpic = cleanEpic.replace(/^#{1,3}\s.*$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
      }
      narratives[slug][`epic_${locale}`] = cleanEpic;
      console.log(`✅ Success: ${cleanEpic.length} chars`);
    } catch (e: any) {
      console.error(`❌ Failed: ${e.message}`);
    }
  }

  fs.writeFileSync(narrativesPath, JSON.stringify(narratives, null, 2), 'utf-8');
  console.log('✅ All anomalies fixed and saved.');
}

fixAnomalies().catch(console.error);
