import fs from 'fs';
import path from 'path';

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');

function findHangulLeaks() {
  console.log("=== Finding Hangul Leaks in final-narratives.json ===");
  if (!fs.existsSync(NARRATIVES_FILE)) {
    console.error(`Master database missing: ${NARRATIVES_FILE}`);
    process.exit(1);
  }

  const narratives = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
  const hangulRegex = /[가-힣]/;
  const leaks: any[] = [];

  const checkText = (text: string, lang: string, slug: string, fieldName: string) => {
    if (!text || lang === 'ko') return;
    
    if (hangulRegex.test(text)) {
      // Find matches and surrounding context
      const matches = text.match(/[가-힣]+/g) || [];
      const matchDetails = matches.map(m => {
        const idx = text.indexOf(m);
        const start = Math.max(0, idx - 15);
        const end = Math.min(text.length, idx + m.length + 15);
        const context = text.substring(start, end).replace(/\n/g, ' ');
        return `"${m}" in context: "...${context}..."`;
      });

      leaks.push({
        lang,
        slug,
        fieldName,
        matches: matchDetails
      });
    }
  };

  for (const slug of Object.keys(narratives)) {
    const g = narratives[slug];
    
    // Check all epic fields
    for (const key of Object.keys(g)) {
      if (key.startsWith('epic_') && key !== 'epic_ko') {
        const lang = key.replace('epic_', '');
        checkText(g[key], lang, slug, key);
      }
      
      // Check trials and overcoming
      if (key.startsWith('trials_') && key !== 'trials_ko') {
        const lang = key.replace('trials_', '');
        checkText(g[key], lang, slug, key);
      }
      if (key.startsWith('overcoming_') && key !== 'overcoming_ko') {
        const lang = key.replace('overcoming_', '');
        checkText(g[key], lang, slug, key);
      }
    }

    // Check fact box translations
    for (const key of Object.keys(g)) {
      if (key.startsWith('fact_box_') && key !== 'fact_box_ko') {
        const lang = key.replace('fact_box_', '');
        const fb = g[key];
        if (fb) {
          checkText(fb.one_line_summary, lang, slug, `${key}.one_line_summary`);
          checkText(fb.legacy_statement, lang, slug, `${key}.legacy_statement`);
          if (Array.isArray(fb.key_achievements)) {
            fb.key_achievements.forEach((ach: string, idx: number) => {
              checkText(ach, lang, slug, `${key}.key_achievements[${idx}]`);
            });
          }
        }
      }
    }

    // Check wisdom translations
    if (g.wisdom && Array.isArray(g.wisdom)) {
      g.wisdom.forEach((w: any, idx: number) => {
        for (const key of Object.keys(w)) {
          if (key.startsWith('quote_') && key !== 'quote_ko') {
            const lang = key.replace('quote_', '');
            checkText(w[key], lang, slug, `wisdom[${idx}].${key}`);
          }
          if (key.startsWith('meaning_') && key !== 'meaning_ko') {
            const lang = key.replace('meaning_', '');
            checkText(w[key], lang, slug, `wisdom[${idx}].${key}`);
          }
        }
      });
    }
  }

  // Generate markdown report
  let report = `# Hangul Leaks Report\n\nTotal Hangul leaks found in non-Korean fields: **${leaks.length}**\n\n`;
  report += `| Locale | Giant | Field | Match Detail |\n`;
  report += `| :--- | :--- | :--- | :--- |\n`;
  
  leaks.forEach(l => {
    report += `| **${l.lang.toUpperCase()}** | \`${l.slug}\` | \`${l.fieldName}\` | ${l.matches.join('<br>')} |\n`;
  });

  const reportPath = path.resolve('scratch/reports/hangul-leaks-report.md');
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`Hangul leak report saved to: ${reportPath}`);
}

findHangulLeaks();
