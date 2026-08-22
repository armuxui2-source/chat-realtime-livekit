const { chromium } = require("playwright");
const path = require("path");

const ARTIFACT_DIR =
  "C:\\Users\\armyn\\.gemini\\antigravity-ide\\brain\\c41c62cc-120d-42ff-9c07-c23b52b92fd8";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { timeout: 30000 });
  await page.waitForTimeout(1500);

  // Auto click Sarah Miller
  try {
    await page.click('button:has-text("Sarah Miller")', { timeout: 4000 });
  } catch (e) {}

  await page.waitForTimeout(1000);

  // 1. Open Stories Modal
  try {
    await page.click('[data-testid="open-stories-btn"]', { timeout: 3000 });
    await page.waitForTimeout(800);
    const storyPath = path.join(ARTIFACT_DIR, "story_viewer_preview.png");
    await page.screenshot({ path: storyPath, fullPage: false });
    console.log("SUCCESS_STORY_SCREENSHOT:", storyPath);

    // Close story modal
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  } catch (e) {
    console.warn("Story err:", e);
  }

  // 2. Open Add Friend Modal
  try {
    await page.click('[data-testid="open-add-friends-btn"]', { timeout: 3000 });
    await page.waitForTimeout(800);
    const friendPath = path.join(ARTIFACT_DIR, "add_friend_preview.png");
    await page.screenshot({ path: friendPath, fullPage: false });
    console.log("SUCCESS_FRIEND_SCREENSHOT:", friendPath);
  } catch (e) {
    console.warn("Friend err:", e);
  }

  await browser.close();
})();
