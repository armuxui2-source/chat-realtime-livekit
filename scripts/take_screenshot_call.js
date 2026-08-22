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

  // Click Video Call button in chat header
  try {
    await page.click('[data-testid="chat-header-video-call-btn"]', { timeout: 3000 });
    await page.waitForTimeout(1500);
    const callPath = path.join(ARTIFACT_DIR, "ig_messenger_call_preview.png");
    await page.screenshot({ path: callPath, fullPage: false });
    console.log("SUCCESS_CALL_SCREENSHOT:", callPath);
  } catch (e) {
    console.warn("Call click error:", e);
  }

  await browser.close();
})();
