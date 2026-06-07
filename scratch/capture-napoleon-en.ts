import puppeteer from 'puppeteer';
import * as path from 'path';

async function run() {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1000 });

  console.log("Navigating to English reels page...");
  // Go to /en/reels for English version
  await page.goto('http://localhost:3000/en/reels', { waitUntil: 'networkidle2' });

  // 1. Select Napoleon Bonaparte character (using English name detection)
  console.log("Selecting Napoleon Bonaparte...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const napoleonBtn = buttons.find(btn => btn.textContent && (btn.textContent.includes("Napoleon") || btn.textContent.includes("나폴레옹")));
    if (napoleonBtn) {
      napoleonBtn.click();
      console.log("Napoleon button clicked in DOM");
    } else {
      console.error("Napoleon button not found");
    }
  });

  await new Promise(r => setTimeout(r, 1500));

  // 2. Click Play Reel button (using English text "Play Reel")
  console.log("Clicking Play Reel...");
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const playBtn = buttons.find(btn => btn.textContent && (btn.textContent.includes("Play Reel") || btn.textContent.includes("릴스 재생")));
    if (playBtn) {
      playBtn.click();
      console.log("Play Reel button clicked in DOM");
    } else {
      console.error("Play Reel button not found");
    }
  });

  // 3. Wait for conversational timeline animation to complete
  console.log("Waiting for typing & food reveal animation to finish...");
  await new Promise(r => setTimeout(r, 13000));

  // 4. Capture screenshot of the reels vertical viewport element
  console.log("Capturing reels viewport screenshot...");
  const viewportEl = await page.$('#reels-viewport');
  if (viewportEl) {
    const outputPath = path.resolve('C:/Users/user/.gemini/antigravity/brain/1d63bcbe-3036-4a9b-99f0-ff3e2bb85ad4/napoleon_reels_mockup_en.png');
    await viewportEl.screenshot({
      path: outputPath
    });
    console.log(`Successfully saved English screenshot to: ${outputPath}`);
  } else {
    console.error("Error: reels-viewport element not found");
  }

  await browser.close();
  console.log("Browser closed successfully.");
}

run().catch(err => {
  console.error("Capture process failed:", err);
});
