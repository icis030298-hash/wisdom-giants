const https = require('https');

const url = 'https://www.giantswisdom.com/fa/giant/king-sejong?bypass=456';

function checkLive() {
  console.log(`Fetching ${url} ...`);
  https.get(url, (res) => {
    let html = '';
    res.on('data', (chunk) => { html += chunk; });
    res.on('end', () => {
      const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        console.log("--- HEAD CONTENT ---");
        console.log(headMatch[1]);
        console.log("--- END HEAD ---");
      }
    });
  });
}
checkLive();
