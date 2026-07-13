const http = require('http');

const urls = [
  'http://localhost:3000/ko/privacy',
  'http://localhost:3000/en/terms',
  'http://localhost:3000/en/about',
  'http://localhost:3000/ko/giant/ludwig-van-beethoven'
];

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, data });
      });
    }).on('error', reject);
  });
}

async function testSpam() {
  let hasErrors = false;
  for (const url of urls) {
    console.log(`Checking ${url}...`);
    try {
      const res = await fetchUrl(url);
      if (res.statusCode !== 200) {
        console.error(`❌ ${url} returned status ${res.statusCode}`);
        hasErrors = true;
      } else {
        const body = res.data;
        let foundSpam = false;
        
        ['[object Object]', '>undefined<', '>null<', 'href="#"', '데이터 준비 중'].forEach(spam => {
          if (body.includes(spam)) {
            console.error(`❌ Spam/Render Error found in ${url}: ${spam}`);
            foundSpam = true;
            hasErrors = true;
          }
        });
        
        if (!foundSpam) {
          console.log(`✅ ${url} is clean (No 404, No Render Errors, No Deadlinks)`);
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${url}: ${e.message}`);
      hasErrors = true;
    }
  }
  
  if (hasErrors) {
    process.exit(1);
  } else {
    console.log('All routes verified and clean.');
  }
}

testSpam();
