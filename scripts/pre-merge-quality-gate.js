const fs = require('fs');
const path = require('path');

const scriptCheckMap = {
  pl: /[łąęśżźóćńŁĄĘŚŻŹÓĆŃ]/,
  uk: /[\u0400-\u04FF]/,
  ru: /[\u0400-\u04FF]/,
  ja: /[\u3040-\u30FF\u4E00-\u9FAF]/,
  he: /[\u0590-\u05FF]/,
  el: /[\u0370-\u03FF]/
};

function runQualityGate(postItem, locale, enPost) {
  const errors = [];

  // (a) Markdown raw symbols in title / description
  if (/\*\*|##|#|\*/.test(postItem.title)) {
    errors.push('Raw markdown symbols found in title');
  }
  if (/\*\*|##|#|\*/.test(postItem.description || '')) {
    errors.push('Raw markdown symbols found in description');
  }

  // (b) Continuous English text in content (8+ consecutive English words)
  const englishSequenceRegex = /[a-zA-Z]{3,}(?:\s+[a-zA-Z]{3,}){7,}/;
  if (englishSequenceRegex.test(postItem.content)) {
    errors.push('Continuous English text (8+ consecutive English words) found in content');
  }

  // (c) Title matches English title
  if (enPost && postItem.title === enPost.translations['en']?.title) {
    errors.push('Title is identical to English title (translation failed)');
  }

  // (d) Description empty
  if (!postItem.description || postItem.description.trim().length === 0) {
    errors.push('Description field is empty or missing');
  }

  // (e) Script / Diacritics check for non-Latin / special script languages
  if (scriptCheckMap[locale]) {
    if (!scriptCheckMap[locale].test(postItem.content)) {
      errors.push(`Required script/diacritics for locale '${locale}' missing in content`);
    }
  }

  // (f) Character length >= 50% of English content length
  if (enPost && enPost.translations['en']?.content) {
    const enLen = enPost.translations['en'].content.length;
    const curLen = postItem.content.length;
    if (curLen < 0.5 * enLen) {
      errors.push(`Content length (${curLen}) is less than 50% of English content length (${enLen})`);
    }
  }

  return {
    passed: errors.length === 0,
    errors
  };
}

module.exports = { runQualityGate };
