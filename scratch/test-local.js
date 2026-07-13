const { spawn } = require('child_process');
const http = require('http');

console.log("Starting local build...");
const buildProc = spawn('cmd', ['/c', 'npm', 'run', 'build'], { cwd: 'C:\\Users\\natey\\Desktop\\wisdom-giants' });

buildProc.stdout.on('data', data => console.log(data.toString()));
buildProc.stderr.on('data', data => console.error(data.toString()));

buildProc.on('close', code => {
  if (code !== 0) {
    console.error(`Build failed with code ${code}`);
    process.exit(1);
  }
  
  console.log("Build successful! Starting server...");
  const startProc = spawn('cmd', ['/c', 'npm', 'run', 'start'], { cwd: 'C:\\Users\\natey\\Desktop\\wisdom-giants' });
  
  startProc.stdout.on('data', data => {
    const output = data.toString();
    console.log(output);
    if (output.includes('Ready in') || output.includes('ready started server on')) {
      console.log("Server ready, fetching /fa/giant/king-sejong...");
      
      setTimeout(() => {
        http.get('http://localhost:3000/fa/giant/king-sejong', (res) => {
          let html = '';
          res.on('data', (chunk) => { html += chunk; });
          res.on('end', () => {
            const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
            if (headMatch) {
              const headContent = headMatch[1];
              
              const robotsMatch = headContent.match(/<meta[^>]*name="robots"[^>]*>/i);
              console.log("\n✅ LOCAL TEST SUCCESS!");
              console.log("Robots Tag:", robotsMatch ? robotsMatch[0] : "NOT FOUND");
              
              const linkTags = headContent.match(/<link[^>]*rel="alternate"[^>]*hreflang[^>]*>/ig) || [];
              console.log(`Found ${linkTags.length} hreflang tags.`);
              
              const hasFa = linkTags.some(tag => tag.includes('hreflang="fa"'));
              console.log("Is 'fa' in hreflang?", hasFa);
              
              console.log("\n--- RAW HEADER SNIPPET ---");
              if (robotsMatch) console.log(robotsMatch[0]);
              if (linkTags.length > 0) console.log(linkTags.slice(0, 3).join('\n') + "\n...");
            }
            startProc.kill();
            process.exit(0);
          });
        });
      }, 3000);
    }
  });
});
