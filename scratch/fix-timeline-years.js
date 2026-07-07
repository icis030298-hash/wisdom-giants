const fs = require('fs');
const path = require('path');

const locales = ['de', 'es', 'fr', 'it', 'ja', 'pt', 'ru', 'zh'];
const dataDir = path.join(process.cwd(), 'src/data/fact-layers');

const months = {
  de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  it: ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
  pt: ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"],
  ru: {
    gen: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
    nom: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
  }
};

const bcTerms = {
  de: " v. Chr.",
  es: " a. C.",
  fr: " av. J.-C.",
  it: " a.C.",
  pt: " a.C.",
  ru: " до н. э.",
  ja: "紀元前",
  zh: "公元前"
};

function formatYearString(original, locale) {
  if (!original) return original;
  
  const regex = /(기원전\s*)?(\d+)년(?:\s*(\d+)월)?(?:\s*(\d+)일)?/g;
  
  let result = original.replace(regex, (match, bc, y, mStr, dStr) => {
    const isBC = !!bc;
    const year = y;
    const month = mStr ? parseInt(mStr, 10) : null;
    const day = dStr ? parseInt(dStr, 10) : null;
    
    let formatted = "";

    if (locale === 'ja' || locale === 'zh') {
      formatted = `${year}年`;
      if (month) formatted += `${month}月`;
      if (day) formatted += `${day}日`;
      if (isBC) formatted = bcTerms[locale] + formatted;
      return formatted;
    }

    const bcStr = isBC ? bcTerms[locale] : "";

    if (locale === 'de') {
      if (day && month) formatted = `${day}. ${months.de[month-1]} ${year}${bcStr}`;
      else if (month) formatted = `${months.de[month-1]} ${year}${bcStr}`;
      else formatted = `${year}${bcStr}`;
    } 
    else if (locale === 'es') {
      if (day && month) formatted = `${day} de ${months.es[month-1]} de ${year}${bcStr}`;
      else if (month) formatted = `${months.es[month-1]} de ${year}${bcStr}`;
      else formatted = `${year}${bcStr}`;
    }
    else if (locale === 'fr') {
      const dayStr = day === 1 ? "1er" : day;
      if (day && month) formatted = `${dayStr} ${months.fr[month-1]} ${year}${bcStr}`;
      else if (month) formatted = `${months.fr[month-1]} ${year}${bcStr}`;
      else formatted = `${year}${bcStr}`;
    }
    else if (locale === 'it') {
      const dayStr = day === 1 ? "1º" : day;
      if (day && month) formatted = `${dayStr} ${months.it[month-1]} ${year}${bcStr}`;
      else if (month) formatted = `${months.it[month-1]} ${year}${bcStr}`;
      else formatted = `${year}${bcStr}`;
    }
    else if (locale === 'pt') {
      if (day && month) formatted = `${day} de ${months.pt[month-1]} de ${year}${bcStr}`;
      else if (month) formatted = `${months.pt[month-1]} de ${year}${bcStr}`;
      else formatted = `${year}${bcStr}`;
    }
    else if (locale === 'ru') {
      if (day && month) formatted = `${day} ${months.ru.gen[month-1]} ${year} г.${bcStr}`;
      else if (month) formatted = `${months.ru.nom[month-1]} ${year} г.${bcStr}`;
      else formatted = `${year} г.${bcStr}`;
    }

    return formatted;
  });

  // Basic cleanup for Korean leftover particles/words sometimes found in year strings
  if (locale !== 'ja' && locale !== 'zh') {
    result = result.replace(/경/g, 'ca. ');
    result = result.replace(/초/g, ' early');
    result = result.replace(/말/g, ' late');
    result = result.replace(/부터/g, 'from ');
    result = result.replace(/까지/g, 'to ');
  }

  return result.trim();
}

let totalFixed = 0;

for (const locale of locales) {
  const filePath = path.join(dataDir, `fact-layer-${locale}.json`);
  if (!fs.existsSync(filePath)) continue;
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let fixedInLocale = 0;
  
  for (const slug in data) {
    const giant = data[slug];
    if (giant.timeline && Array.isArray(giant.timeline)) {
      giant.timeline.forEach(item => {
        if (item.year && /[년월일]/.test(item.year)) {
          item.year = formatYearString(item.year, locale);
          fixedInLocale++;
          totalFixed++;
        }
      });
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Locale: ${locale}, Fixed 'year' fields: ${fixedInLocale}`);
}

console.log(`\nTotal 'year' fields reformatted: ${totalFixed}`);
