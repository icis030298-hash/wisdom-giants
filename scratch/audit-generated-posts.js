const fs = require('fs');
const path = require('path');

// Paths
const BLOG_POSTS_PATH = path.join(__dirname, '..', 'src', 'data', 'blog-posts.ts');
const GIANTS_PATH = path.join(__dirname, '..', 'src', 'data', 'giants.ts');
const TEMP_BLOG_PATH = path.join(__dirname, 'temp-audit-blog.js');
const TEMP_GIANTS_PATH = path.join(__dirname, 'temp-audit-giants.js');

// Helper to convert TS file to JS for node require
function tsToJs(filePath, tempPath, exportVarName) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/export interface [\s\S]*?\n\}/g, '');
  content = content.replace(new RegExp(`export const ${exportVarName}(:\\s*\\w+(\\[\\])?)?\\s*=`), `const ${exportVarName} =`);
  content = content.replace(/export\s+/g, '');
  content += `\nmodule.exports = { ${exportVarName} };`;
  fs.writeFileSync(tempPath, content, 'utf8');
}

// Convert files
tsToJs(BLOG_POSTS_PATH, TEMP_BLOG_PATH, 'blogPosts');
tsToJs(GIANTS_PATH, TEMP_GIANTS_PATH, 'giantsData');

// Load modules
const { blogPosts } = require(TEMP_BLOG_PATH);
const { giantsData } = require(TEMP_GIANTS_PATH);

// Clean up temp files
fs.unlinkSync(TEMP_BLOG_PATH);
fs.unlinkSync(TEMP_GIANTS_PATH);

// Valid giant slugs set
const validGiantSlugs = new Set(giantsData.map(g => g.slug));

console.log(`Auditing ${blogPosts.length} blog posts against Joan of Arc Standard...`);

let issuesCount = 0;
const report = {
  volumeDeficient: [],
  structureDeficient: [],
  encodingErrors: [],
  markdownPollution: [],
  crossLanguagePollution: [],
  ctaMappingErrors: [],
};

const koreanRegex = /[\uAC00-\uD7A3]/;

blogPosts.forEach((post, i) => {
  const slug = post.slug;
  const category = post.category;
  const giantSlug = post.giantSlug;
  const translations = post.translations || {};

  // Check 1: Giant Slug Validity
  if (!validGiantSlugs.has(giantSlug)) {
    report.ctaMappingErrors.push({
      slug,
      giantSlug,
      issue: `giantSlug "${giantSlug}" does not exist in giants.ts!`
    });
    issuesCount++;
  }

  // Check translations
  const localesToCheck = ['ko', 'en', 'ja'];
  localesToCheck.forEach(locale => {
    const trans = translations[locale];
    if (!trans) {
      report.crossLanguagePollution.push({
        slug,
        locale,
        issue: `Missing translation pack for "${locale}"!`
      });
      issuesCount++;
      return;
    }

    const title = trans.title || '';
    const desc = trans.description || '';
    const content = trans.content || '';

    // Check 2: Volume
    if (locale === 'ko' || locale === 'ja') {
      if (content.length < 1500) {
        report.volumeDeficient.push({
          slug,
          locale,
          length: content.length,
          issue: `Length is ${content.length} characters (expected 1500+).`
        });
        issuesCount++;
      }
    } else if (locale === 'en') {
      const wordCount = content.trim().split(/\s+/).length;
      if (wordCount < 800) {
        report.volumeDeficient.push({
          slug,
          locale,
          wordCount,
          issue: `Word count is ${wordCount} words (expected 800+).`
        });
        issuesCount++;
      }
    }

    // Check 3: H3 subheadings structure
    const lines = content.split('\n');
    const h3s = lines.filter(line => line.trim().startsWith('###'));
    if (h3s.length < 4) {
      report.structureDeficient.push({
        slug,
        locale,
        h3Count: h3s.length,
        issue: `Contains only ${h3s.length} H3 headings (expected 4+).`
      });
      issuesCount++;
    }

    // Check 4: Unicode encoding errors
    if (content.includes('\uFFFD')) {
      report.encodingErrors.push({
        slug,
        locale,
        issue: `Contains replacement characters (\\uFFFD).`
      });
      issuesCount++;
    }

    // Check 5: Markdown pollution (asterisks in headings)
    h3s.forEach(h => {
      if (h.includes('**')) {
        report.markdownPollution.push({
          slug,
          locale,
          heading: h,
          issue: `H3 heading contains bold asterisks (**): "${h}"`
        });
        issuesCount++;
      }
    });

    // Check 6: Cross-Language Pollution (Korean characters in en or ja)
    if (locale !== 'ko') {
      // Find matches of Korean characters
      const matches = content.match(/[\uAC00-\uD7A3]+/g);
      if (matches) {
        report.crossLanguagePollution.push({
          slug,
          locale,
          matches: matches.slice(0, 5),
          issue: `Contains Korean characters in "${locale}" translation!`
        });
        issuesCount++;
      }
    }

    // Check 7: CTA Link Verification
    const expectedCtaLink = `/giant/${giantSlug}`;
    if (!content.includes(expectedCtaLink)) {
      report.ctaMappingErrors.push({
        slug,
        locale,
        expectedCtaLink,
        issue: `CTA link does not match expected path: ${expectedCtaLink}`
      });
      issuesCount++;
    }
  });
});

console.log('\n==========================================');
console.log('AUDIT RESULTS');
console.log('==========================================');
console.log(`Total Issues Found: ${issuesCount}`);
console.log(JSON.stringify(report, null, 2));
console.log('==========================================');
