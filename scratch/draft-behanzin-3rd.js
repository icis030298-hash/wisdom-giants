const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({path:'.env.local'});

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const behanzinEpic1st = `나는 왕자 시절 콘도(Kondo)라는 이름으로 알려졌지만, 1889년 아버지 글렐레의 뒤를 이어 왕위에 오르면서 베한진이라는 이름을 갖게 되었다. 나의 이름은 '세상은 달걀을 들고 있다'는 뜻으로, 나의 왕국 다호메이의 섬세하지만 소중한 운명을 상징했다. 당시 프랑스는 서아프리카 전역으로 세력을 확장하고 있었고, 우리 조상들의 땅에 대한 그들의 야욕은 명백했다. 나는 그들이 우리 해안 도시 코토누를 점령하고 우리 주권의 심장을 위협하는 것을 보았다. 나는 평화를 원했지만, 노예가 되느니 전사가 되는 길을 택했다.

1890년, 제1차 프랑스-다호메이 전쟁이 발발했다. 프랑스인들은 그들의 총과 대포가 우리를 쉽게 굴복시킬 것이라 믿었지만, 그들은 나의 군대, 특히 세계적으로 유명한 미노, 즉 '아마존' 여전사들의 용맹함을 과소평가했다. 우리는 맹렬히 싸웠고, 적에게 막대한 피해를 입혔다. 전쟁은 교착 상태에 빠졌고, 결국 불안한 평화 조약이 체결되었다. 나는 이 시간을 낭비하지 않았다. 나는 유럽에서 더 많은 무기를 구입하고 군대를 현대화하며 프랑스와의 피할 수 없는 다음 충돌에 대비했다.

1892년, 프랑스는 훨씬 더 큰 규모의 군대를 이끌고 돌아왔다. 제2차 프랑스-다호메이 전쟁은 우리 왕국의 생존을 건 싸움이었다. 우리는 용감하게 맞섰고, 초토화 전술을 사용하며 저항했지만, 적의 압도적인 화력을 당해낼 수는 없었다. 나의 수도 아보메는 불탔고, 나는 숲으로 후퇴하여 게릴라전을 계속했다. 나는 왕으로서의 항복을 거부했다. 나는 자유로운 다호메이의 왕이지, 프랑스의 꼭두각시가 아니었기 때문이다.

2년 가까이 저항을 계속했지만, 나의 백성들이 겪는 고통은 점점 더 커져만 갔다. 더 이상의 무의미한 희생을 막기 위해, 나는 1894년 1월 15일, 프랑스군에 나 자신을 내주었다. 그들은 나를 왕으로 대우하겠다고 약속했지만, 대신 나를 서인도 제도의 마르티니크로, 그리고 나중에는 알제리로 유배 보냈다. 나는 다시는 나의 땅을 밟지 못하고 1906년 알제에서 눈을 감았다. 그러나 나의 육신은 죽었을지언정, 나의 저항 정신은 아프리카의 자유를 갈망하는 모든 이들의 마음속에 영원히 살아 숨 쉴 것이다.`;

async function main() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const prompt = `Translate or rewrite the following Korean 1st-person epic story of a historical giant into a 3rd-person biography style (e.g., replace "나는", "나의" with "그는", "그의", "베한진은" etc.). Keep the tone epic, solemn, and consistent with Korean history textbook/biography style (위인전 스타일).

INPUT TEXT:
${behanzinEpic1st}

Return the rewritten 3rd-person Korean text only.`;

  const result = await model.generateContent(prompt);
  console.log("=== 3rd Person Rewrite Behanzin ===");
  console.log(result.response.text());
}

main().catch(console.error);
