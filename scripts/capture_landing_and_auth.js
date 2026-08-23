const { chromium } = require("playwright");
const path = require("path");

const ARTIFACT_DIR =
  "C:\\Users\\armyn\\.gemini\\antigravity-ide\\brain\\c41c62cc-120d-42ff-9c07-c23b52b92fd8";

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Capture Bento Landing Page
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000", { timeout: 30000 });
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(1500);

  const landingPath = path.join(ARTIFACT_DIR, "bento_landing_preview.png");
  await page.screenshot({ path: landingPath, fullPage: false });
  console.log("SUCCESS_LANDING_SCREENSHOT:", landingPath);

  // 2. Open Clean Auth Modal & Capture
  try {
    await page.click('[data-testid="landing-login-btn"]', { timeout: 3000 });
    await page.waitForTimeout(800);
    const authPath = path.join(ARTIFACT_DIR, "clean_auth_modal_preview.png");
    await page.screenshot({ path: authPath, fullPage: false });
    console.log("SUCCESS_AUTH_SCREENSHOT:", authPath);
  } catch (e) {
    console.warn("Auth click err:", e);
  }

  await browser.close();
})();
