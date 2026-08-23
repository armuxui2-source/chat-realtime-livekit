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

  // Quick Login if on Landing
  try {
    const isLanding = await page.$('button:has-text("ทดลองเล่น Live Demo ทันที")');
    if (isLanding) {
      await page.click('button:has-text("ทดลองเล่น Live Demo ทันที")', { timeout: 3000 });
      await page.waitForTimeout(1500);
    }
  } catch (e) {}

  // 1. Capture clean 3-column layout without bottom video button
  const cleanSidebarPath = path.join(ARTIFACT_DIR, "clean_sidebar_preview.png");
  await page.screenshot({ path: cleanSidebarPath, fullPage: false });
  console.log("SUCCESS_CLEAN_SIDEBAR:", cleanSidebarPath);

  // 2. Open Instagram Profile Drawer
  try {
    await page.click('[data-testid="open-edit-profile-btn"]', { timeout: 3000 });
    await page.waitForTimeout(1000);
    const igProfilePath = path.join(ARTIFACT_DIR, "instagram_profile_drawer_preview.png");
    await page.screenshot({ path: igProfilePath, fullPage: false });
    console.log("SUCCESS_IG_PROFILE:", igProfilePath);
  } catch (e) {
    console.warn("Profile open err:", e);
  }

  await browser.close();
})();
