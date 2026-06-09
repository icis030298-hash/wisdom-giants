import { NextRequest, NextResponse } from "next/server";
import { VertexAI } from "@google-cloud/vertexai";
import fs from "fs";
import path from "path";

let vertexAIInstance: VertexAI | null = null;

function getVertexAIInstance() {
  if (vertexAIInstance) return vertexAIInstance;
  
  const projectId = process.env.GCP_PROJECT_ID || 'giantswisdom-8dc26';
  const location = process.env.GCP_LOCATION || 'us-central1';
  
  // Try loading from local service account file first
  const localKeyPath = path.resolve(process.cwd(), 'google-service-account.json');
  let credentials;
  
  if (fs.existsSync(localKeyPath)) {
    try {
      credentials = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
    } catch (e) {
      console.error("Failed to parse local google-service-account.json", e);
    }
  }
  
  // Fallback to environment variable
  if (!credentials && process.env.GCP_SERVICE_ACCOUNT) {
    try {
      credentials = JSON.parse(process.env.GCP_SERVICE_ACCOUNT);
    } catch (e) {
      console.error("Failed to parse GCP_SERVICE_ACCOUNT environment variable", e);
    }
  }
  
  const initOptions: any = {
    project: projectId,
    location: location,
  };
  
  if (credentials) {
    initOptions.googleAuthOptions = {
      credentials,
    };
  } else {
    console.warn("No GCP credentials found. Vertex AI will fall back to default application credentials.");
  }
  
  vertexAIInstance = new VertexAI(initOptions);
  return vertexAIInstance;
}

export async function POST(req: NextRequest) {
  try {
    const { userProblem, locale = 'en' } = await req.json();
    if (!userProblem || typeof userProblem !== 'string') {
      return NextResponse.json({ error: "Invalid user problem" }, { status: 400 });
    }

    const vAI = getVertexAIInstance();
    
    // Stable models to try
    const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let responseText = "";
    let lastError = null;

    const systemPrompt = `당신은 사용자의 고민을 분석하고 적절한 역사적 인물(거인)을 매칭해주는 AI 조언가입니다.
사용자의 고민 텍스트가 주어지면, 아래 13명의 위인 중 그들의 인생 역경과 가장 공감대가 높은 위인을 **정확히 3명** 매칭해주십시오.
각 위인별로 왜 이 위인이 매칭되었는지, 이 위인도 어떤 동일한 고통(역경)을 이겨냈는지 상세히 설명해주는 매칭 사유(reason)를 작성해주십시오.
매칭 사유는 사용자의 locale에 지정된 언어(ko, en, de, ja, es, fr, it, pt)로 작성되어야 합니다. (지정된 locale: "${locale}", 지정되지 않았거나 기본값은 en)

13명의 위인 명단과 그들의 핵심 고난/역경:
1. 에이브러햄 링컨(abraham-lincoln): 수많은 선거 패배, 사업 파산, 가족의 상실, 극심한 우울증을 극복하고 미국의 가장 위대한 대통령이 됨. (실패, 우울, 회복탄력성)
2. 마리 퀴리(marie-curie): 가난, 고국을 떠난 유학 생활, 여성 과학자로서의 차별과 편견, 남편의 비극적인 죽음 속에서도 최초로 노벨상 2회 수상. (역경, 차별, 의지)
3. 소크라테스(socrates): 아테네 시민들의 무지와 비난, 사형 선고 앞에서도 자신의 철학적 신념을 지키며 독배를 마심. (신념, 군중 압박, 신념)
4. 토마스 에디슨(thomas-edison): 청각 장애, 어린 시절의 학습 장애, 전구 발명을 위해 겪은 수만 번의 실패를 딛고 끈기와 의지로 기술 혁신을 이룸. (실패, 끈기, 몰입)
5. 빈센트 반 고흐(vincent-van-gogh): 지독한 가난, 평생의 외로움과 고독, 정신질환과 우울증의 고통 속에서도 예술적 열정을 불태워 인류 역사에 남는 명작들을 그림. (고독, 우울, 열정)
6. 아이작 뉴턴(isaac-newton): 흑사병 유행으로 인한 고립된 유배 생활, 동료 과학자들과의 끊임없는 성과 논쟁과 갈등, 심약한 정신적 불안을 극복하고 만유인력 법칙을 발견. (고독, 논쟁, 창의성)
7. 세네카(seneca): 로마 황제 네로의 폭정 속에서 상시적인 사형 위협과 불안, 결국 자결 명령을 받는 극도의 비극적 압박 속에서도 마인드 컨트롤을 고수한 스토아 철학자. (압박, 죽음, 마음의 평정)
8. 마르쿠스 아우렐리우스(marcus-aurelius): 황제로서 짊어진 전쟁, 역병, 국가 파탄의 책임과 배신, 매일 밤 성찰을 통해 마음을 단련한 철인 황제. (책임감, 번아웃, 평온함)
9. 나폴레옹 보나파르트(napoleon-bonaparte): 코르시카 섬의 가난한 소수민족 출신으로 겪은 무시와 아웃사이더 생활, 이를 스스로의 결단과 전략으로 돌파하여 유럽을 제패함. (고립, 야망, 결단력)
10. 세종대왕(king-sejong): 시각 장애를 포함한 평생의 수많은 지병, 한글 창제를 반대하는 사대부들의 거센 반대와 압박 속에서도 백성을 위한 훈민정음을 창제. (반대, 건강, 헌신)
11. 공자(confucius): 14년간의 끊임없는 천하유랑과 생명의 위협, 알아주는 이 없는 고독과 자식·제자들의 잇따른 죽음 속에서도 인간다움(인)의 철학을 완성. (상실, 외로움, 교육)
12. 레오나르도 다 빈치(leonardo-da-vinci): 사생아 출신이라는 신분적 한계, 너무 많은 관심 분야로 인한 주의 산만과 미완성작들에 대한 자책과 완벽주의적 불안. (한계, 완벽주의, 주의 산만)
13. 정약용(jeong-yak-yong): 18년간의 전라남도 강진 유배 생활, 가문의 멸족 위기와 유배의 고독 속에서도 흔들리지 않고 목민심서 등 500여 권의 위대한 학문적 저술을 완성. (고립, 상실, 실용적 지혜)

출력 형식은 엄격한 JSON 형태여야 합니다. JSON 코드 블록(예: \`\`\`json) 등 마크다운 장식 없이 순수 JSON 문자열만 리턴해 주십시오:
{
  "matchedGiants": [
    {
      "slug": "위인 슬러그",
      "reason": "사용자 언어로 작성된 개인 맞춤형 매칭 사유"
    },
    ... (반드시 딱 3명만 포함)
  ]
}

사용자의 고민:
"${userProblem}"`;

    for (const modelName of modelsToTry) {
      try {
        const model = vAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        
        if (typeof response.text === 'function') {
          responseText = response.text();
        } else {
          responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
        
        if (responseText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[Match Model failed] ${modelName}:`, err.message);
      }
    }

    if (!responseText && lastError) {
      throw lastError;
    }

    return new NextResponse(responseText, {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: any) {
    console.error("Match API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to match giants" }, { status: 500 });
  }
}
