const { spawn } = require('child_process');
const http = require('http');

console.log("Starting next dev...");
const nextProcess = spawn('cmd', ['/c', 'npm', 'run', 'dev'], { cwd: 'C:\\Users\\natey\\Desktop\\wisdom-giants' });

let isStarted = false;

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Ready in') || output.includes('ready started server on')) {
    if (!isStarted) {
      isStarted = true;
      console.log("Server is ready. Fetching /fa/giant/king-sejong in 15 seconds...");
      
      setTimeout(() => {
        http.get('http://localhost:3000/fa/giant/king-sejong', (res) => {
          let html = '';
          res.on('data', (chunk) => { html += chunk; });
          res.on('end', () => {
            console.log("\n--- HTML HEADER START ---");
            const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
            if (headMatch) {
              const headContent = headMatch[1];
              // Print only relevant SEO tags
              const robotsMatch = headContent.match(/<meta[^>]*name="robots"[^>]*>/i);
              console.log("Robots Tag:", robotsMatch ? robotsMatch[0] : "NOT FOUND");
              
              const linkTags = headContent.match(/<link[^>]*rel="alternate"[^>]*hreflang[^>]*>/ig) || [];
              console.log(`Found ${linkTags.length} hreflang tags.`);
              
              const hasFa = linkTags.some(tag => tag.includes('hreflang="fa"'));
              console.log("Is 'fa' in hreflang?", hasFa);
              
              console.log("\n--- RAW HEADER SNIPPET ---");
              if (robotsMatch) console.log(robotsMatch[0]);
              if (linkTags.length > 0) console.log(linkTags.slice(0, 3).join('\n') + "\n...");
            } else {
              console.log("No <head> found in response!");
            }
            console.log("--- HTML HEADER END ---\n");
            nextProcess.kill();
            process.exit(0);
          });
        }).on('error', (e) => {
          console.error(`Got error: ${e.message}`);
          nextProcess.kill();
          process.exit(1);
        });
      }, 15000); // 15 seconds to let Next.js compile the route
    }
  }
});
