import fs from 'fs';
import path from 'path';

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const TRANSLATIONS_DIR = path.resolve('scratch/translations');

function runVerification() {
  const masterData = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
  const finalFiles = fs.readdirSync(TRANSLATIONS_DIR).filter(f => f.startsWith('final-') && f.endsWith('.json'));
  
  let failures: any[] = [];

  for (const f of finalFiles) {
    const langCode = f.replace('final-', '').replace('.json', '');
    if (langCode === 'ko') continue; // Skip source

    const transData = JSON.parse(fs.readFileSync(path.join(TRANSLATIONS_DIR, f), 'utf8'));
    
    for (const slug of Object.keys(transData)) {
      const trans = transData[slug];
      const master = masterData[slug];
      let rowFailures: string[] = [];
      
      // 1. Factbox achievements length
      if (trans.fact_box?.key_achievements?.length !== master.fact_box?.key_achievements?.length) {
        rowFailures.push(`Factbox length mismatch: Master=${master.fact_box?.key_achievements?.length}, Translated=${trans.fact_box?.key_achievements?.length}`);
      }
      
      // 2. 4 Paragraphs
      const pCount = trans.narrative.split(/\n+/).filter((p: string) => p.trim().length > 0).length;
      if (pCount !== 4) {
        rowFailures.push(`Narrative is not 4 paragraphs (found ${pCount})`);
      }
      
      // 3. No empty fields
      if (!trans.narrative.trim()) rowFailures.push('Narrative is empty');
      if (!trans.fact_box?.one_line_summary?.trim()) rowFailures.push('one_line_summary is empty');
      if (!trans.fact_box?.legacy_statement?.trim()) rowFailures.push('legacy_statement is empty');
      trans.fact_box?.key_achievements?.forEach((ach: string, idx: number) => {
        if (!ach.trim()) rowFailures.push(`Achievement ${idx} is empty`);
      });

      // 4. Korean text leak check (only for non-ko)
      if (langCode !== 'ko' && langCode !== 'ja' && langCode !== 'zh') {
        // Japanese and Chinese might share some hanja/kanji, but pure hangul [가-힣] shouldn't be there
        if (/[가-힣]/.test(trans.narrative) || /[가-힣]/.test(trans.fact_box?.one_line_summary)) {
          // Allow some tolerance? Just flag it.
          rowFailures.push('Contains Korean characters (Hangul leak)');
        }
      }

      // 5. English text leak check (only for non-en)
      if (langCode !== 'en') {
        const engStopWords = /\b(the|of|with|that|this|it|for)\b/gi;
        const narrativeMatches = trans.narrative.match(engStopWords) || [];
        if (narrativeMatches.length >= 15) {
          rowFailures.push(`Contains English content (English leak, found ${narrativeMatches.length} stop words)`);
        }
      }

      if (rowFailures.length > 0) {
        failures.push({
          lang: langCode,
          slug: slug,
          errors: rowFailures
        });
      }
    }
  }

  const reportPath = path.resolve('scratch/reports/verification-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(failures, null, 2));
  console.log(`Verification complete. Found ${failures.length} issues.`);
  console.log(`Report saved to: ${reportPath}`);
}

runVerification();
