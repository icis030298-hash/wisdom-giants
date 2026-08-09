const fs = require('fs');
if (!fs.existsSync('scratch')) fs.mkdirSync('scratch');
const data = JSON.parse(fs.readFileSync('scratch/search-300-500.json'));
let md = '# 300 / 500 포함 문자열 매칭 결과\n\n';
const grouped = {};
data.forEach(d => {
  if (!grouped[d.key]) grouped[d.key] = [];
  grouped[d.key].push({ file: d.file, text: d.text });
});

for (let key in grouped) {
  md += `### \`${key}\`\n`;
  grouped[key].slice(0, 3).forEach(g => {
    md += `- **${g.file}**: ${g.text}\n`;
  });
  if (grouped[key].length > 3) {
    md += `- ... (총 ${grouped[key].length}개 언어 파일에서 동일 키 발견)\n`;
  }
  md += '\n';
}

fs.writeFileSync('scratch/match_report.md', md);
console.log('Done');
