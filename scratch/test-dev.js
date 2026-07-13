const { spawn } = require('child_process');
const http = require('http');

console.log("Starting next dev...");
const nextProcess = spawn('npm', ['run', 'dev'], { cwd: 'C:\\Users\\natey\\Desktop\\wisdom-giants', shell: true });

let isStarted = false;

nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  if (output.includes('Ready in') || output.includes('ready started server on')) {
    if (!isStarted) {
      isStarted = true;
      console.log("Server is ready. Fetching /fa/giant/king-sejong...");
      
      setTimeout(() => {
        http.get('http://localhost:3000/fa/giant/king-sejong', (res) => {
          let html = '';
          res.on('data', (chunk) => { html += chunk; });
          res.on('end', () => {
            console.log("\n--- HTML HEADER START ---");
            const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
            if (headMatch) {
              const headContent = headMatch[1];
              // Print only relevant SEO tags to avoid huge output
              const metaTags = headContent.match(/<meta[^>]*>/g) || [];
              const linkTags = headContent.match(/<link[^>]*hreflang[^>]*>/g) || [];
              
              metaTags.forEach(tag => {
                if (tag.includes('robots')) console.log(tag);
              });
              
              console.log("\nHreflang Links:");
              linkTags.forEach(tag => console.log(tag));
              
              console.log("\nIs 'fa' in hreflang?", html.includes('hreflang="fa"'));
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
      }, 5000); // give it 5 seconds to compile the page
    }
  }
});

nextProcess.stderr.on('data', (data) => {
  // console.error(`stderr: ${data}`);
});

setTimeout(() => {
  console.log("Timeout waiting for server.");
  nextProcess.kill();
  process.exit(1);
}, 60000);
