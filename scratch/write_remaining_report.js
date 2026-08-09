const fs = require('fs');

const bData = JSON.parse(fs.readFileSync('scratch/b_reinvestigated.json', 'utf8'));
const cData = JSON.parse(fs.readFileSync('scratch/c_filtered_strict.json', 'utf8'));
const trueDisc = JSON.parse(fs.readFileSync('scratch/true_discrepancies.json', 'utf8'));

let bReport = '';
bData.forEach(item => {
  bReport += `- **${item.slug}** (${item.locale}): 현재 표기 오류로 엉뚱한 동음이의어 문서(예: ${item.correctWikiTitle})에 매칭되었습니다. 정확한 영어 문서 \`${item.enTitle}\` 기준으로 다시 찾아본 해당 언어권 실제 백과사전 표기는 **${item.correctWikiTitle}** 입니다.\n`;
});

// Build cross table for C
const allLocales = ['ar', 'de', 'el', 'es', 'fa', 'fr', 'ha', 'he', 'hi', 'id', 'it', 'ja', 'ko', 'nl', 'pl', 'pt', 'ru', 'sw', 'th', 'tr', 'uk', 'vi', 'zh'];
const crossTable = {};
allLocales.forEach(l => crossTable[l] = 0);
cData.forEach(item => {
  if (crossTable[item.locale] !== undefined) crossTable[item.locale]++;
});

let cTable = '| 언어 | 정제된 C 유형 건수 |\n|---|---|\n';
let totalC = 0;
allLocales.forEach(l => {
  if (crossTable[l] > 0) {
    cTable += `| **${l}** | ${crossTable[l]} |\n`;
    totalC += crossTable[l];
  }
});
cTable += `| **총계** | **${totalC}** |\n`;

const report = `# 잔여 불일치 데이터(B, C 유형) 재검토 보고서

지시하신 대로 A 유형(기계번역 참사) 16건은 즉시 수정 후 \`fix(i18n): correct 16 critical machine translation errors in giant names\` 메시지로 커밋을 완료했습니다. (LLM이 잘못 분류했던 2건은 제외했습니다)

이하 B 유형과 C 유형에 대한 재필터링 결과입니다.

## 1. B 유형(동음이의어/환각) 재조사 결과 (총 15건)

이 건들은 현재 우리의 표기(\`localName\`)가 해당 언어 위키백과에서 인물이 아닌 **동음이의어(disambiguation)** 문서 등으로 연결된 케이스입니다. 영어판 기준 정확한 문서(예: \`Seneca the Younger\`)로 다시 매칭하여 정확한 표기값을 찾아냈습니다.

${bReport}
*(단, \`abraham-lincoln\`과 \`roald-amundsen\`의 하우사어(ha) 2건은 말씀하신 대로 원문에 없는 문장(\`Ibrahim\`, \`ne adam wata\`)이 덧붙은 '진짜 AI 환각'이 맞습니다. 이 2건만 수정하고 나머지는 현상 유지하는 것을 권장합니다.)*

## 2. C 유형 1,249건 재필터링 결과 (최종 ${totalC}건)

대표님께서 설정해주신 4가지 엄격한 제외 기준(a, b, c, d)을 스크립트로 적용하여, 1,249건 중 위험군 415건을 전량 폐기하고 **가장 안전하고 확실한 표기법 오류(철자, 음차 교정) ${totalC}건만 남겼습니다.**

### [제외된 기준 및 건수 (총 415건 제거)]
1. **(a) 괄호 한정어 포함 (27건 제외)**: \`(disambigua)\`, \`(توضيح)\` 등 동명이인 구분용 괄호가 포함된 경우 배제.
2. **(b) 이름 일부 제거 (325건 제외)**: \`Наполеон Бонапарт\` ➔ \`Наполеон\`처럼 기존 이름보다 단어 수가 줄어들거나 길이가 짧아져 검색 매칭률이 떨어질 우려가 있는 경우 전면 배제.
3. **(c, d) 설명구/칭호 추가 (63건 제외)**: 기존 표기보다 훨씬 길어지면서 \`왕\`, \`king\`, \`대제\` 등의 부가 설명이 붙는 경우 배제.

### [남은 ${totalC}건의 로케일별 분포]

${cTable}

### 🔴 사용자 승인 요청 (User Review Required)
- **B 유형 15건**: 하우사어(ha)의 환각 2건만 C 유형에 편입시켜 수정하고, 나머지 동음이의어 13건은 현상 유지할까요?
- **C 유형 ${totalC}건**: 이 필터링된 데이터만으로 복구 패치를 마저 진행할까요?

승인해 주시면 즉시 패치 후 마무리하겠습니다.
`;

fs.writeFileSync('C:/Users/user/.gemini/antigravity/brain/bb3327d3-aebc-42a2-9b7f-ddba2f88a732/investigation_report_remaining.md', report, 'utf8');
console.log('Artifact created');
