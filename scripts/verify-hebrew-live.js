const https = require('https');

const targetUrl = 'https://www.giantswisdom.com/he/giant/king-sejong';

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
  console.log(`=== Verifying Hebrew Live URL: ${targetUrl} ===`);
  
  try {
    const res = await fetchUrl(targetUrl);
    if (res.statusCode !== 200) {
      console.log(`[FAIL] Live page returned status: ${res.statusCode}`);
      return;
    }
    
    const body = res.body;
    
    // 1. Check for [RTL he] or other debug tags
    const hasDebugTag = body.includes('[RTL he]') || body.includes('RTL he');
    console.log(`- Debug tag [RTL he] exists? ${hasDebugTag ? '⚠️ YES (Failed)' : '✓ NO (Passed)'}`);
    
    // 2. Check if text is reversed (e.g. '.eciov namuh yreve fo' or '.dlrow')
    const reversedSample = '.eciov namuh yreve fo';
    const hasReversedText = body.includes(reversedSample) || body.includes('eciov namuh');
    console.log(`- Reversed sample text ("eciov namuh") exists? ${hasReversedText ? '⚠️ YES (Failed)' : '✓ NO (Passed)'}`);
    
    // 3. Check if clean English fallback is rendered correctly
    const cleanSample = 'of every human voice';
    const hasCleanText = body.includes(cleanSample);
    console.log(`- Clean English fallback ("of every human voice") exists? ${hasCleanText ? '✓ YES (Passed)' : '❌ NO (Failed)'}`);
    
    // 4. Verify overall Hangul leakage on this page
    const hangulRegex = /[\uac00-\ud7a3]/g;
    const hangulMatches = body.match(hangulRegex) || [];
    console.log(`- Hangul characters found: ${hangulMatches.length}`);
    
    if (!hasDebugTag && !hasReversedText && hasCleanText) {
      console.log("\n🎉 Verification SUCCESS: Hebrew text inversion & debug tag leakage resolved in live production!");
    } else {
      console.log("\n❌ Verification FAILED: The issue is still present on the live site.");
    }
  } catch (e) {
    console.error("Error during live fetch:", e.message);
  }
}

main();
