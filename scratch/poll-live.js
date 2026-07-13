const https = require('https');

let attempt = 0;

function checkLive() {
  attempt++;
  // Cache busting query param
  const url = `https://www.giantswisdom.com/fa/giant/king-sejong?bypass=${Date.now()}`;
  console.log(`[Attempt ${attempt}] Fetching ${url} ...`);
  
  https.get(url, (res) => {
    let html = '';
    res.on('data', (chunk) => { html += chunk; });
    res.on('end', () => {
      const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        const headContent = headMatch[1];
        
        // Find robots tag
        const robotsMatch = headContent.match(/<meta[^>]*name="robots"[^>]*>/i);
        
        if (robotsMatch) {
          console.log("\n✅ SUCCESS: Robots tag found!");
          console.log("Robots Tag:", robotsMatch[0]);
          
          // Find all hreflang tags
          const linkTags = headContent.match(/<link[^>]*rel="alternate"[^>]*hreflang[^>]*>/ig) || [];
          console.log(`Found ${linkTags.length} hreflang tags.`);
          
          const hasFa = linkTags.some(tag => tag.includes('hreflang="fa"'));
          console.log("Is 'fa' in hreflang?", hasFa);
          
          console.log("\n--- RAW HEADER SNIPPET ---");
          console.log(robotsMatch[0]);
          if (linkTags.length > 0) {
            console.log(linkTags.slice(0, 3).join('\n') + "\n...");
          }
        } else {
          console.log("Still no robots tag. Vercel build might still be running. Retrying in 10s...");
          if (attempt < 15) {
            setTimeout(checkLive, 10000);
          } else {
            console.log("Timeout waiting for Vercel deployment.");
          }
        }
      } else {
        console.log("Could not find <head> tag. Retrying in 10s...");
        setTimeout(checkLive, 10000);
      }
    });
  }).on('error', (e) => {
    console.error(e);
    setTimeout(checkLive, 10000);
  });
}

checkLive();
