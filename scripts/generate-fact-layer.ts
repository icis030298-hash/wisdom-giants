import fs from 'fs'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function generateFactLayer() {
  const wikiSources = JSON.parse(
    fs.readFileSync('scripts/wiki-source-pilot.json', 'utf8')
  )

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
  if (!apiKey) {
    console.error('❌ API KEY NOT FOUND')
    return
  }
  console.log('✅ API KEY LOADED:', apiKey.substring(0, 5) + '...')
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-pro',
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2
    }
  })

  const results: Record<string, any> = {}

  for (const [slug, extract] of Object.entries(wikiSources)) {
    if (!extract || (extract as string).trim().length === 0) {
      console.log(`⚠️ ${slug}: 본문 없음, 스킵`)
      continue
    }

    console.log(`Generating facts for ${slug}...`)

    const systemPrompt = `
# Role
당신은 'Giants Wisdom'의 역사 사실 검증 에디터입니다.

# 절대 규칙 (가장 중요)
1. 아래 제공된 "출처 원문" 에 명시적으로 나온 사실만 사용하라. 원문에 없는 사실은 절대 추가하지 마라.
2. 원문에 불충분한 정보가 있으면 해당 항목을 생략하라. 불확실한 추측으로 채우지 마라.
3. 다른 인물의 철학/업적과 절대 혼동하지 마라. (예: 디오게네스를 플라톤의 이데아론과 혼동한 과거 사고를 반드시 피하라)
4. 모든 연도, 이름, 사건은 출처 원문에서 직접 확인 가능해야 한다.
5. 출처 원문에 없는 내용이면 "정보 부족으로 생략"이라고 내부 판단하고 해당 필드를 비워라.

# 입력
인물: ${slug}
출처 원문 (위키피디아): """
${(extract as string).substring(0, 30000)} // Truncate to avoid context limit if extremely long, though Gemini handles large contexts well
"""

# 출력 (JSON만, 다른 설명 금지)
{
  "slug": "${slug}",
  "timeline": [
    { "year": "연도", "event": "사건 (원문 근거)" }
    // 원문에서 확인되는 것만, 최대 6개
  ],
  "keyAchievements": [
    { "title": "업적명", "description": "1문장 설명" }
    // 원문 근거, 최대 3개
  ],
  "faq": [
    { "question": "자주 묻는 질문", "answer": "1~2문장 답변" }
    // 원문 근거, 정확히 3개
  ],
  "sourceVerified": true,
  "missingDataNote": "원문에서 확인 안 된 부분 메모 (있는 경우만)"
}
`

    try {
      const result = await model.generateContent(systemPrompt)
      const responseText = result.response.text()
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        results[slug] = parsed
        console.log(`✅ ${slug} 성공`)
      } else {
        console.error(`❌ ${slug} JSON 파싱 실패`)
      }
    } catch (e: any) {
      console.error(`❌ ${slug} API 에러: ${e.message}`)
    }

    // Rate limit for safety
    await new Promise(r => setTimeout(r, 2000))
  }

  fs.writeFileSync(
    'src/data/fact-layer-pilot.json',
    JSON.stringify(results, null, 2)
  )
  console.log('완료: src/data/fact-layer-pilot.json 생성됨')
}

generateFactLayer().catch(console.error)
