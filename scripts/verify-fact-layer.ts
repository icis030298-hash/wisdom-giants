import fs from 'fs'
import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function verifyFactLayer() {
  const factData = JSON.parse(
    fs.readFileSync('src/data/fact-layer-pilot.json', 'utf8')
  )

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.1
    }
  })

  let allValid = true

  console.log('=== 사실 레이어 자기 검증 (Self-Verification) 시작 ===')

  for (const [slug, data] of Object.entries(factData)) {
    console.log(`Verifying ${slug}...`)

    const verificationPrompt = `
아래는 '${slug}'(이)라는 역사적 인물에 대해 생성된 사실 정보(JSON)입니다.
이것이 실제로 해당 인물에 대한 정확한 역사적 사실이 맞는지, 혹시 다른 인물(예: 디오게네스와 플라톤)의 사실이나 업적이 섞여 들어가지 않았는지 판별하십시오.

생성된 정보:
${JSON.stringify(data, null, 2)}

판단 기준:
1. 명백히 다른 인물의 핵심 업적이 섞여 있다면 'INVALID'와 그 이유를 반환하십시오.
2. 사실에 부합하고 혼동이 없다면 오직 'VALID'만 반환하십시오.
`
    try {
      const result = await model.generateContent(verificationPrompt)
      const responseText = result.response.text().trim()

      if (responseText.startsWith('VALID')) {
        console.log(`✅ ${slug}: 검증 통과 (VALID)`)
      } else {
        console.log(`❌ ${slug}: 검증 실패 (INVALID)`)
        console.log(`이유: ${responseText}`)
        allValid = false
      }
    } catch (e: any) {
      console.error(`❌ ${slug} API 에러: ${e.message}`)
      allValid = false
    }

    await new Promise(r => setTimeout(r, 1000))
  }

  console.log('======================================================')
  if (allValid) {
    console.log('🎉 모든 10명 파일럿 데이터가 자기 검증을 통과했습니다.')
  } else {
    console.log('⚠️ 일부 데이터가 검증을 통과하지 못했습니다. 수동 확인이 필요합니다.')
  }
}

verifyFactLayer().catch(console.error)
