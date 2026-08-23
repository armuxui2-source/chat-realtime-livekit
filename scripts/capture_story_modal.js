const { chromium } = require("playwright");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Quick Login
  const quickLoginBtn = page.locator('[data-testid="hero-quick-demo-btn"]');
  if ((await quickLoginBtn.count()) > 0) {
    await quickLoginBtn.click();
    await page.waitForTimeout(2000);
  }

  // Click on Story Tray Add My Story button
  const addStoryBtn = page.locator('[data-testid="story-tray"] > div').first();
  await addStoryBtn.waitFor({ state: "visible", timeout: 5000 });
  await addStoryBtn.click();
  await page.waitForTimeout(600);

  const screenshotPath = path.join(__dirname, "..", "story_creation_studio_preview.png");
  await page.screenshot({ path: screenshotPath });
  console.log("Captured story studio preview to", screenshotPath);

  await browser.close();
}

main().catch(console.error);
