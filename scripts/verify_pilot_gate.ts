import { validateTranslationItem } from '../src/lib/injection-gate';
import { blogPosts } from '../src/data/blog-posts';
import * as fs from 'fs';
import * as path from 'path';

const locales = ['ar', 'th', 'hi', 'fa', 'nl', 'tr', 'vi', 'zh'];

console.log('=== PILOT VERIFICATION & INJECTION GATE TEST ===\n');

const report: any = {};

locales.forEach(loc => {
  const filePath = `scratch/out_${loc}_pilot.json`;
  if (!fs.existsSync(filePath)) {
    console.log(`[ERROR] File missing: ${filePath}`);
    return;
  }

  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  report[loc] = {
    titles: [],
    sampleContent: '',
    gateResults: []
  };

  items.forEach((item: any) => {
    const enPost = blogPosts.find(p => p.slug === item.slug);
    const enTitle = enPost?.translations['en']?.title || '';

    const gateRes = validateTranslationItem(
      { ...item, enTitle },
      new Map()
    );

    report[loc].titles.push({
      slug: item.slug,
      enTitle,
      translatedTitle: item.title
    });

    report[loc].gateResults.push({
      slug: item.slug,
      valid: gateRes.valid,
      errors: gateRes.reasons
    });
  });

  // Pick the first item's content as sample
  report[loc].sampleContent = items[0]?.content || '';
});

// Write gate verification report
fs.writeFileSync('scratch/pilot_gate_report.json', JSON.stringify(report, null, 2), 'utf8');

// ==========================================
// TURKISH DIACRITICS PIPELINE CHECK
// ==========================================
console.log('=== TURKISH (tr) SPECIAL CHARACTER PIPELINE CHECK ===');
const trItems = JSON.parse(fs.readFileSync('scratch/out_tr_pilot.json', 'utf8'));
const trCharsRegex = /[ıçğşöüİ]/g;

trItems.forEach((item: any, idx: number) => {
  const fileChars = (item.title + item.description + item.content).match(trCharsRegex) || [];
  console.log(`Item ${idx + 1} (${item.slug}):`);
  console.log(`  (a) In JSON File: Found ${fileChars.length} Turkish diacritics (ı,ç,ğ,ş,ö,ü,İ)`);

  const enPost = blogPosts.find(p => p.slug === item.slug);
  const enTitle = enPost?.translations['en']?.title || '';
  const gateRes = validateTranslationItem({ ...item, enTitle }, new Map());
  const gateChars = (item.title + item.description + item.content).match(trCharsRegex) || [];
  console.log(`  (b) After Gate (${gateRes.valid ? 'PASSED' : 'FAILED'}): Found ${gateChars.length} Turkish diacritics`);
});

