const https = require('https');

const url = 'https://www.giantswisdom.com/fa/giant/king-sejong?bypass=123';

function checkLive() {
  console.log(`Fetching ${url} ...`);
  https.get(url, (res) => {
    let html = '';
    res.on('data', (chunk) => { html += chunk; });
    res.on('end', () => {
      const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        const headContent = headMatch[1];
        
        // Find robots tag
        const robotsMatch = headContent.match(/<meta[^>]*name="robots"[^>]*>/i);
        console.log("Robots Tag:", robotsMatch ? robotsMatch[0] : "NOT FOUND");
        
        // Find all hreflang tags
        const linkTags = headContent.match(/<link[^>]*rel="alternate"[^>]*hreflang[^>]*>/ig) || [];
        console.log(`Found ${linkTags.length} hreflang tags.`);
        
        const hasFa = linkTags.some(tag => tag.includes('hreflang="fa"'));
        console.log("Is 'fa' in hreflang?", hasFa);
        
      } else {
        console.log("Could not find <head> tag. Maybe 404?");
        console.log(html.substring(0, 500));
      }
    });
  }).on('error', (e) => {
    console.error(e);
  });
}

checkLive();
