import fs from 'fs'
import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function processBatch() {
  const sourcesFile = 'scripts/wiki-sources-all.json'
  const resultsFile = 'src/data/fact-layer-all.json'

  if (!fs.existsSync(sourcesFile)) {
    console.error(`❌ ${sourcesFile} 파일이 없습니다. 먼저 위키 데이터를 수집하세요.`)
    return
  }

  const wikiSources = JSON.parse(fs.readFileSync(sourcesFile, 'utf8'))
  let results: Record<string, any> = {}

  if (fs.existsSync(resultsFile)) {
    results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'))
    console.log(`✅ 기존 완료된 데이터 로드 성공 (${Object.keys(results).length}건)`)
  }

  // AI Studio 무료 키 제거 및 GCP 서비스 계정 강제 활성화
  delete process.env.GEMINI_API_KEY
  delete process.env.NEXT_PUBLIC_GEMINI_API_KEY
  process.env.GOOGLE_CLOUD_PROJECT = 'giantswisdom-8dc26';
  process.env.GOOGLE_CLOUD_LOCATION = 'us-central1';

  const ai = new GoogleGenAI({
    vertexai: {
      project: 'giantswisdom-8dc26',
      location: 'us-central1'
    }
  });

  const slugs = Object.keys(wikiSources)
  let count = 0
  let newlyProcessed = 0
  let errorCount = 0

  for (const slug of slugs) {
    if (results[slug]) {
      continue // 이미 처리된 경우 건너뜀
    }

    const extract = wikiSources[slug]
    if (!extract || extract.trim().length < 50) {
      console.log(`⚠️ ${slug}: 본문이 너무 짧거나 없음, 스킵`)
      results[slug] = { slug, timeline: [], keyAchievements: [], faq: [], sourceVerified: false, missingDataNote: "위키 본문 없음" }
      continue
    }

    console.log(`⏳ 처리 중: ${slug} (${count + 1}/${slugs.length})`)

    const systemPrompt = `
# Role
당신은 'Giants Wisdom'의 역사 사실 검증 에디터입니다.

# 절대 규칙 (가장 중요)
1. 아래 제공된 "출처 원문" 에 명시적으로 나온 사실만 사용하라. 원문에 없는 사실은 절대 추가하지 마라.
2. 원문에 불충분한 정보가 있으면 해당 항목을 생략하라. 불확실한 추측으로 채우지 마라.
3. 다른 인물의 철학/업적과 절대 혼동하지 마라.
4. 모든 연도, 이름, 사건은 출처 원문에서 직접 확인 가능해야 한다.
5. 출처 원문에 없는 내용이면 "정보 부족으로 생략"이라고 내부 판단하고 해당 필드를 비워라.

# 입력
인물: ${slug}
출처 원문 (위키피디아): """
${extract.substring(0, 30000)}
"""

# 출력 (반드시 아래 구조의 JSON만 출력할 것)
{
  "slug": "${slug}",
  "timeline": [
    { "year": "연도", "event": "사건 (원문 근거)" }
  ],
  "keyAchievements": [
    { "title": "업적명", "description": "1문장 설명" }
  ],
  "faq": [
    { "question": "자주 묻는 질문", "answer": "1~2문장 답변" }
  ],
  "sourceVerified": true,
  "missingDataNote": "원문에서 확인 안 된 부분 메모 (있는 경우만)"
}
`

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: systemPrompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });
      const responseText = response.text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        results[slug] = parsed
        console.log(`✅ ${slug} 완료`)
        newlyProcessed++
      } else {
        console.error(`❌ ${slug} JSON 파싱 실패`)
        errorCount++
      }
    } catch (e: any) {
      console.error(`❌ ${slug} API 에러: ${e.message}`)
      errorCount++
      // 429 에러 등을 대비해 에러 발생 시 조금 더 대기
      await new Promise(r => setTimeout(r, 5000))
    }

    count++

    // 10명 단위로 중간 보고 및 저장
    if (newlyProcessed > 0 && newlyProcessed % 10 === 0) {
      fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2))
      console.log(`💾 중간 저장 완료. (정상: ${newlyProcessed}, 에러: ${errorCount})`)
    }

    // Rate limit for safety (Agent Platform Limit is much higher, 500ms is safe)
    await new Promise(r => setTimeout(r, 500))
  }

  // 최종 저장
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2))
  console.log(`\n🎉 배치 작업 최종 완료!`)
  console.log(`총 ${Object.keys(results).length}명 데이터 확보. 새로 추가된 인원: ${newlyProcessed}명, 실패: ${errorCount}명`)
}

processBatch()
