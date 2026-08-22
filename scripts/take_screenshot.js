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

  // Auto click Sarah Miller to enter
  try {
    await page.click('button:has-text("Sarah Miller")', { timeout: 4000 });
  } catch (e) {}

  await page.waitForTimeout(1500);

  // 1. Take main chat preview
  const previewPath = path.join(ARTIFACT_DIR, "live_preview.png");
  await page.screenshot({ path: previewPath, fullPage: false });
  console.log("SUCCESS_SCREENSHOT:", previewPath);

  // 2. Click User Profile button in Left Nav to open Profile Card Hub
  try {
    await page.click('[data-testid="user-profile-button"]', { timeout: 3000 });
    await page.waitForTimeout(800);
    const profilePath = path.join(ARTIFACT_DIR, "profile_card_hub.png");
    await page.screenshot({ path: profilePath, fullPage: false });
    console.log("SUCCESS_PROFILE_CARD_HUB:", profilePath);

    // 3. Click Edit Details Card to test Slide Drawer
    await page.click('[data-testid="card-edit-details"]', { timeout: 3000 });
    await page.waitForTimeout(600);
    const drawerPath = path.join(ARTIFACT_DIR, "profile_slide_drawer.png");
    await page.screenshot({ path: drawerPath, fullPage: false });
    console.log("SUCCESS_PROFILE_DRAWER:", drawerPath);
  } catch (e) {
    console.warn("Profile click err:", e);
  }

  await browser.close();
})();
