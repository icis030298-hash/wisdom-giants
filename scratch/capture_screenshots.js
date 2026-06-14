const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 1000 });

  const artifactsDir = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4';

  console.log("Navigating to homepage...");
  await page.goto('http://localhost:3000/ko', { waitUntil: 'networkidle2' });
  
  // Scroll to trigger any lazy loading or hydration
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await new Promise(r => setTimeout(r, 1000));
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise(r => setTimeout(r, 2000));
  
  console.log("Taking homepage screenshot...");
  await page.screenshot({ path: path.join(artifactsDir, 'screenshot_ko_home.png'), fullPage: true });

  console.log("Navigating to blog...");
  await page.goto('http://localhost:3000/ko/blog', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  
  // Find first blog link
  const firstBlogHref = await page.evaluate(() => {
    const link = document.querySelector('a[href*="/blog/"]');
    return link ? link.href : null;
  });

  if (firstBlogHref) {
    console.log(`Navigating to blog post: ${firstBlogHref}`);
    await page.goto(firstBlogHref, { waitUntil: 'networkidle2' });
    
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await new Promise(r => setTimeout(r, 1000));
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise(r => setTimeout(r, 2000));
    
    console.log("Taking blog post screenshot...");
    await page.screenshot({ path: path.join(artifactsDir, 'screenshot_blog_post.png'), fullPage: true });
  } else {
    console.log("No blog post link found on /ko/blog.");
  }

  await browser.close();
  console.log("Done taking screenshots.");
}

main().catch(err => {
  console.error("Screenshot error:", err);
  process.exit(1);
});
