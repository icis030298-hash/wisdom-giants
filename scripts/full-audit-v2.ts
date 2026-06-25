import fs from 'fs';
import path from 'path';
import { giantsData } from '../src/data/giants';
import finalNarratives from '../src/data/final-narratives.json';
import wikipediaLinks from '../src/data/wikipedia-links.json';

const LOCALES = ['ko', 'en', 'de', 'ja', 'es', 'fr', 'it', 'pt', 'ar', 'hi', 'ru', 'zh'] as const;

interface AuditError {
  slug: string;
  name: string;
  locale?: string;
  type: 'missing_narrative' | 'language_leak' | 'particle_leak' | 'short_slide' | 'paragraph_mismatch' | 'broken_wiki_link' | 'spacing_anomaly';
  details: string;
}

const errors: AuditError[] = [];

async function audit() {
  console.log(`Starting Audit v2 on ${giantsData.length} giants...`);

  // Load wiki links mapping
  const wikiMap = wikipediaLinks as Record<string, Record<string, string>>;
  const narrativesMap = finalNarratives as Record<string, Record<string, any>>;

  for (const giant of giantsData) {
    const slug = giant.slug;
    const name = giant.name;
    const narrative = narrativesMap[slug];

    if (!narrative) {
      errors.push({
        slug,
        name,
        type: 'missing_narrative',
        details: `Giant does not exist in final-narratives.json`
      });
      continue;
    }

    // Check Wikipedia links exist and are valid URLs
    const links = wikiMap[slug];
    if (!links) {
      errors.push({
        slug,
        name,
        type: 'broken_wiki_link',
        details: `No Wikipedia links defined in wikipedia-links.json`
      });
    } else {
      if (!links.ko || !links.ko.startsWith('https://ko.wikipedia.org/')) {
        errors.push({
          slug,
          name,
          type: 'broken_wiki_link',
          details: `Invalid or missing Korean Wikipedia link: ${links.ko}`
        });
      }
      if (!links.en || !links.en.startsWith('https://en.wikipedia.org/')) {
        errors.push({
          slug,
          name,
          type: 'broken_wiki_link',
          details: `Invalid or missing English Wikipedia link: ${links.en}`
        });
      }
    }

    // Audit narratives for all supported locales
    for (const locale of LOCALES) {
      const epicKey = `epic_${locale}`;
      const epicText = narrative[epicKey];

      if (!epicText) {
        // Only warn for non-ko/en as they might be partially populated, but ko/en are critical
        if (locale === 'ko' || locale === 'en') {
          errors.push({
            slug,
            name,
            locale,
            type: 'missing_narrative',
            details: `Missing critical narrative field ${epicKey}`
          });
        }
        continue;
      }

      // Check paragraph split (must be exactly or at least 4 paragraphs)
      const paragraphs = epicText.split(/\n\n|\\n\\n/).map((p: string) => p.trim()).filter(Boolean);
      if (paragraphs.length !== 4) {
        errors.push({
          slug,
          name,
          locale,
          type: 'paragraph_mismatch',
          details: `Narrative has ${paragraphs.length} paragraphs (expected exactly 4)`
        });
      }

      // Check slide length
      paragraphs.forEach((p: string, idx: number) => {
        if (p.length < 50) {
          errors.push({
            slug,
            name,
            locale,
            type: 'short_slide',
            details: `Paragraph ${idx + 1} is too short (${p.length} chars): "${p.substring(0, 30)}..."`
          });
        }
      });

      // Check for language leaks (Korean unicode range: \uAC00-\uD7A3)
      if (locale !== 'ko') {
        const koreanMatch = /[\uAC00-\uD7A3]/.exec(epicText);
        if (koreanMatch) {
          errors.push({
            slug,
            name,
            locale,
            type: 'language_leak',
            details: `Korean characters leaked in non-ko narrative: ...${epicText.substring(Math.max(0, koreanMatch.index - 20), koreanMatch.index + 20)}...`
          });
        }
      }

      // Check for Korean particle leak on English words (e.g. "impenetrable한") in Korean locale
      if (locale === 'ko') {
        const particleMatch = /[a-zA-Z]{3,}(한|을|를|이|가|의|에|는)\b/.exec(epicText);
        if (particleMatch) {
          errors.push({
            slug,
            name,
            locale,
            type: 'particle_leak',
            details: `Korean particle attached to English word: "${particleMatch[0]}"`
          });
        }

        // Spacing anomaly check (e.g. double spaces or spaces inside words)
        if (/ {2,}/.test(epicText)) {
          errors.push({
            slug,
            name,
            locale,
            type: 'spacing_anomaly',
            details: `Double spaces detected in text`
          });
        }
      }
    }
  }

  // Perform static code check for JSON-LD schema locale guards in page.tsx
  const pagePath = path.resolve(process.cwd(), 'src/app/[locale]/giant/[slug]/page.tsx');
  if (fs.existsSync(pagePath)) {
    const pageCode = fs.readFileSync(pagePath, 'utf-8');
    
    // Check FAQPage schema guard
    const hasFaqGuard = pageCode.includes("faqSchema = locale === 'ko'") || pageCode.includes("faqSchema = (locale === 'ko'");
    if (!hasFaqGuard) {
      errors.push({
        slug: 'page.tsx',
        name: 'SEO Schema Guard Check',
        type: 'language_leak',
        details: 'FAQPage schema is not strictly guarded by locale === \'ko\' in page.tsx'
      });
    }

    // Check Quotation schema guard
    const hasQuotationGuard = pageCode.includes("quotationSchema = locale === 'ko'") || pageCode.includes("quotationSchema = (locale === 'ko'");
    if (!hasQuotationGuard) {
      errors.push({
        slug: 'page.tsx',
        name: 'SEO Schema Guard Check',
        type: 'language_leak',
        details: 'Quotation schema is not strictly guarded by locale === \'ko\' in page.tsx'
      });
    }
  }

  console.log('\n--- Audit Results ---');
  if (errors.length === 0) {
    console.log('✓ Success: 0 errors found!');
  } else {
    console.error(`✗ Failed: Found ${errors.length} errors.`);
    // Group and print errors by type
    const grouped = errors.reduce((acc, err) => {
      acc[err.type] = (acc[err.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    console.log('Error counts by type:', grouped);

    // Print first 10 errors for brevity
    console.log('\nSample errors (first 15):');
    errors.slice(0, 15).forEach((err, idx) => {
      console.log(`[${idx + 1}] Giant: ${err.name} (${err.slug}) | Type: ${err.type} | Locale: ${err.locale || 'all'} | Details: ${err.details}`);
    });

    // Write full audit report to file
    const reportPath = path.resolve(process.cwd(), 'scripts/audit-report-v2.json');
    fs.writeFileSync(reportPath, JSON.stringify(errors, null, 2), 'utf-8');
    console.log(`\nFull report written to ${reportPath}`);
  }
}

audit();
