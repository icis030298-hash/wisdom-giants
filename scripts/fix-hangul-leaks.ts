import fs from 'fs';
import path from 'path';

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');

function fixHangulLeaks() {
  console.log("=== Fixing Hangul Leaks in final-narratives.json ===");
  if (!fs.existsSync(NARRATIVES_FILE)) {
    console.error(`Master database missing: ${NARRATIVES_FILE}`);
    process.exit(1);
  }

  let fileContent = fs.readFileSync(NARRATIVES_FILE, 'utf8');

  const replacements = [
    {
      // AR mozart: الري퀴يم -> الريكويم
      target: "الري퀴يم",
      replacement: "الريكويم"
    },
    {
      // AR rabindranath-tagore: ك깃ار -> كجيتار
      target: "ك깃ار",
      replacement: "كجيتار"
    },
    {
      // ZH dante-alighieri: 贝아트丽切 -> 贝阿特丽切
      target: "贝아트丽切",
      replacement: "贝阿特丽切"
    },
    {
      // ZH paul-cezanne: 제시了全新的 -> 呈现了全新的
      target: "제시了全新的",
      replacement: "呈现了全新的"
    },
    {
      // RU yun-dong-ju: 대표작ы -> главные произведения
      target: "대표작ы",
      replacement: "главные произведения"
    },
    {
      // JA bumin-qaghan: 횃불となりました -> ともしびとなりました
      target: "횃불となりました",
      replacement: "ともしびとなりました"
    },
    {
      // JA al-farghani: 접근しにくい -> 近づきにくい
      target: "접근しにくい",
      replacement: "近づきにくい"
    },
    {
      // JA kassia: Intellectual/spiritual capacity (역량 -> 力量)
      target: "역량を立証する",
      replacement: "力量を立証する"
    },
    {
      // TR ibrahim-muteferrika: 도입u -> girişi
      target: "도입u",
      replacement: "girişi"
    }
  ];

  let appliedCount = 0;
  for (const r of replacements) {
    if (fileContent.includes(r.target)) {
      // Replace all occurrences
      const parts = fileContent.split(r.target);
      fileContent = parts.join(r.replacement);
      console.log(`Successfully replaced: "${r.target}" -> "${r.replacement}"`);
      appliedCount++;
    } else {
      console.warn(`Target not found in database: "${r.target}"`);
    }
  }

  if (appliedCount > 0) {
    fs.writeFileSync(NARRATIVES_FILE, fileContent, 'utf8');
    console.log(`=== Done! ${appliedCount} Hangul leaks fixed in final-narratives.json ===`);
  } else {
    console.log("No targets found to replace.");
  }
}

fixHangulLeaks();
