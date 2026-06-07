import puppeteer from 'puppeteer';
import * as path from 'path';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set larger viewport to comfortably render dashboard + reels frame
  await page.setViewport({ width: 1280, height: 1000 });

  console.log("Navigating to reels page...");
  await page.goto('http://localhost:3000/ko/reels', { waitUntil: 'networkidle2' });

  // 1. Select Napoleon Bonaparte character
  console.log("Selecting Napoleon Bonaparte...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const napoleonBtn = buttons.find(btn => btn.textContent && btn.textContent.includes("나폴레옹"));
    if (napoleonBtn) {
      napoleonBtn.click();
      console.log("Napoleon button clicked in DOM");
    } else {
      console.error("Napoleon button not found");
    }
  });

  // Wait 1.5 seconds for selection change and resetting timeline
  await new Promise(r => setTimeout(r, 1500));

  // 2. Click Play Reel button
  console.log("Clicking Play Reel...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const playBtn = buttons.find(btn => btn.textContent && btn.textContent.includes("릴스 재생"));
    if (playBtn) {
      playBtn.click();
      console.log("Play Reel button clicked in DOM");
    } else {
      console.error("Play Reel button not found");
    }
  });

  // 3. Wait for conversational timeline animation to complete (typing takes about 11 seconds)
  console.log("Waiting for typing & food reveal animation to finish...");
  await new Promise(r => setTimeout(r, 13000));

  // 4. Capture screenshot of the reels vertical viewport element
  console.log("Capturing reels viewport screenshot...");
  const viewportEl = await page.$('#reels-viewport');
  if (viewportEl) {
    const outputPath = path.resolve('C:/Users/user/.gemini/antigravity/brain/1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4/napoleon_reels_mockup.png');
    await viewportEl.screenshot({
      path: outputPath
    });
    console.log(`Successfully saved screenshot to: ${outputPath}`);
  } else {
    console.error("Error: reels-viewport element not found");
  }

  await browser.close();
  console.log("Browser closed successfully.");
}

run().catch(err => {
  console.error("Capture process failed:", err);
});
