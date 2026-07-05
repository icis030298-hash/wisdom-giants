const https = require('https');

const urls = [
  { name: 'Arabic Mozart', url: 'https://www.giantswisdom.com/ar/giant/mozart' },
  { name: 'Arabic Tagore', url: 'https://www.giantswisdom.com/ar/giant/rabindranath-tagore' },
  { name: 'Chinese Dante', url: 'https://www.giantswisdom.com/zh/giant/dante-alighieri' },
  { name: 'Chinese Cezanne', url: 'https://www.giantswisdom.com/zh/giant/paul-cezanne' },
  { name: 'Russian Yun Dong-ju', url: 'https://www.giantswisdom.com/ru/giant/yun-dong-ju' },
  { name: 'Japanese Bumin Qaghan', url: 'https://www.giantswisdom.com/ja/giant/bumin-qaghan' },
  { name: 'Japanese Al-Farghani', url: 'https://www.giantswisdom.com/ja/giant/al-farghani' },
  { name: 'Japanese Kassia', url: 'https://www.giantswisdom.com/ja/giant/kassia' },
  { name: 'Turkish Ibrahim Muteferrika', url: 'https://www.giantswisdom.com/tr/giant/ibrahim-muteferrika' }
];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    }).on('error', (err) => reject(err));
  });
}

async function main() {
  console.log("=== Checking Hangul Leaks on Live URLs ===");
  
  for (const item of urls) {
    try {
      const res = await fetchUrl(item.url);
      if (res.statusCode !== 200) {
        console.log(`[FAIL] ${item.name} (${item.url}) - Status code: ${res.statusCode}`);
        continue;
      }
      
      // Match Hangul range: \uac00-\ud7a3 (가-힣)
      // Exclude common template terms if they are in Korean like "거인들의 전당" or footer but the goal is to check if translation page content leaks Korean
      // Let's count how many Korean characters exist.
      const hangulRegex = /[\uac00-\ud7a3]/g;
      const matches = res.body.match(hangulRegex) || [];
      
      // We also look for specific placeholders like "데이터 준비 중..." (commonly leaks when missing)
      const hasDataPreparing = res.body.includes("데이터 준비 중");
      
      console.log(`- ${item.name}: Found ${matches.length} Hangul characters.`);
      if (hasDataPreparing) {
        console.log(`  ⚠️ Warning: Contains "데이터 준비 중..."`);
      }
      if (matches.length > 0) {
        // Sample some matched strings (e.g. text around matches)
        // Let's log if there are massive leaks. (Usually templates have some Korean if user visited in ko, but if we curl specifically the non-ko page, 
        // the template should be localized to ar, zh, ru, ja, tr, so there should be 0 Hangul except perhaps the name "Giants Wisdom" (which is English) 
        // or logo text if hardcoded). Let's see.
        console.log(`  [INFO] Sample Hangul content found.`);
      }
    } catch (e) {
      console.error(`[ERROR] Failed to fetch ${item.name}:`, e.message);
    }
  }
}

main();
