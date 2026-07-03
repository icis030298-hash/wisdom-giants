/**
 * Missing Fields Audit Script
 * Scans final-narratives.json for missing translation fields across all languages
 * Reports: trials, overcoming, wisdom quotes, era, fact_box per language
 */
import fs from 'fs';
import path from 'path';

const NARRATIVES_FILE = path.resolve('src/data/final-narratives.json');
const REPORTS_DIR = path.resolve('scratch/reports');
const OUTPUT_FILE = path.join(REPORTS_DIR, 'missing-fields.md');

// All supported languages (excluding ko which is the base)
const ALL_LANGS = ['ar','bn','cs','de','el','en','es','fa','fr','ha','he','hi','hu','id','it','ja','nl','pl','pt','ro','ru','sv','sw','th','tr','uk','vi','zh'];

// Fields to audit per language
const PER_LANG_FIELDS = ['fact_box', 'era', 'epic'];
// Fields with sub-keys in wisdom array
const WISDOM_FIELDS = ['quote', 'meaning'];
// Non-language-specific narrative fields (ko-based)
const KO_NARRATIVE_FIELDS = ['trials_ko', 'overcoming_ko'];

interface FieldStats {
  total: number;
  missing: number;
  pct: number;
  missingList: string[];
}

interface LangReport {
  [field: string]: FieldStats;
}

const narratives: Record<string, any> = JSON.parse(fs.readFileSync(NARRATIVES_FILE, 'utf8'));
const slugs = Object.keys(narratives);

if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

console.log(`Auditing ${slugs.length} giants across ${ALL_LANGS.length} languages...`);

// --- Per-language field audit ---
const langReports: Record<string, LangReport> = {};

for (const lang of ALL_LANGS) {
  langReports[lang] = {};
  for (const field of PER_LANG_FIELDS) {
    const key = field === 'fact_box' ? `fact_box_${lang}` : `${field}_${lang}`;
    const missing: string[] = [];
    for (const slug of slugs) {
      const g = narratives[slug];
      if (!g) { missing.push(slug); continue; }
      if (field === 'fact_box') {
        const fb = g[key];
        if (!fb || !fb.one_line_summary || fb.one_line_summary.trim() === '') missing.push(slug);
      } else {
        const val = g[key];
        if (!val || val.toString().trim() === '') missing.push(slug);
      }
    }
    langReports[lang][field] = {
      total: slugs.length,
      missing: missing.length,
      pct: Math.round((missing.length / slugs.length) * 100),
      missingList: missing
    };
  }

  // Wisdom quotes audit (at least 1 quote_XX in wisdom array)
  const wisdomMissing: string[] = [];
  for (const slug of slugs) {
    const g = narratives[slug];
    const wisdom = g?.wisdom || [];
    const hasQuote = wisdom.some((w: any) => w[`quote_${lang}`] && w[`quote_${lang}`].trim() !== '');
    if (!hasQuote) wisdomMissing.push(slug);
  }
  langReports[lang]['wisdom_quote'] = {
    total: slugs.length,
    missing: wisdomMissing.length,
    pct: Math.round((wisdomMissing.length / slugs.length) * 100),
    missingList: wisdomMissing
  };
}

// --- KO narrative fields audit (trials_ko, overcoming_ko) ---
const koReport: Record<string, FieldStats> = {};
for (const field of KO_NARRATIVE_FIELDS) {
  const missing: string[] = [];
  for (const slug of slugs) {
    const g = narratives[slug];
    if (!g?.[field] || g[field].trim() === '') missing.push(slug);
  }
  koReport[field] = {
    total: slugs.length,
    missing: missing.length,
    pct: Math.round((missing.length / slugs.length) * 100),
    missingList: missing
  };
}

// --- Generate Markdown Report ---
const lines: string[] = [];
lines.push('# Missing Fields Audit Report');
lines.push(`> Generated: ${new Date().toISOString()}`);
lines.push(`> Total Giants: ${slugs.length}`);
lines.push('');
lines.push('## Summary Table: % Missing per Language × Field');
lines.push('');
lines.push('| Language | fact_box | era | epic | wisdom_quote |');
lines.push('|----------|----------|-----|------|-------------|');

for (const lang of ALL_LANGS) {
  const r = langReports[lang];
  const cols = ['fact_box', 'era', 'epic', 'wisdom_quote'].map(f => {
    const s = r[f];
    return s ? `${s.missing}/${s.total} (${s.pct}%)` : 'N/A';
  });
  lines.push(`| ${lang} | ${cols.join(' | ')} |`);
}

lines.push('');
lines.push('## Korean Narrative Fields (trials_ko, overcoming_ko)');
lines.push('');
lines.push('| Field | Missing |');
lines.push('|-------|---------|');
for (const [field, stats] of Object.entries(koReport)) {
  lines.push(`| ${field} | ${stats.missing}/${stats.total} (${stats.pct}%) |`);
}

lines.push('');
lines.push('## Fully Translated Languages (fact_box 0% missing)');
lines.push('');
const fullyTranslated = ALL_LANGS.filter(l => langReports[l]['fact_box'].missing === 0);
lines.push(fullyTranslated.length > 0 ? fullyTranslated.join(', ') : '_None_');

lines.push('');
lines.push('## Languages Needing Attention (fact_box > 50% missing)');
lines.push('');
const needsAttention = ALL_LANGS
  .filter(l => langReports[l]['fact_box'].pct > 50)
  .map(l => `${l} (${langReports[l]['fact_box'].pct}% missing)`);
lines.push(needsAttention.length > 0 ? needsAttention.join(', ') : '_None_');

lines.push('');
lines.push('## Detailed Missing Slugs by Language (fact_box only, top languages)');
lines.push('');
const problematic = ALL_LANGS
  .filter(l => langReports[l]['fact_box'].missing > 0 && langReports[l]['fact_box'].missing < 50)
  .sort((a, b) => langReports[a]['fact_box'].missing - langReports[b]['fact_box'].missing);

for (const lang of problematic) {
  const stats = langReports[lang]['fact_box'];
  lines.push(`### ${lang} — ${stats.missing} missing`);
  lines.push('');
  lines.push('```');
  lines.push(stats.missingList.join(', '));
  lines.push('```');
  lines.push('');
}

const report = lines.join('\n');
fs.writeFileSync(OUTPUT_FILE, report);
console.log(`\n✅ Report saved to: ${OUTPUT_FILE}`);
console.log('\nSummary:');
console.log('Fully translated:', fullyTranslated.join(', '));
console.log('Needs attention:', needsAttention.join(', ') || 'None');
