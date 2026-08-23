const { chromium } = require("playwright");
const path = require("path");

const ARTIFACT_DIR =
  "C:\\Users\\armyn\\.gemini\\antigravity-ide\\brain\\c41c62cc-120d-42ff-9c07-c23b52b92fd8";

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Profile Drawer View
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

  // Open Profile Drawer
  try {
    await page.click('[data-testid="open-edit-profile-btn"]', { timeout: 3000 });
    await page.waitForTimeout(1000);
    const profilePath = path.join(ARTIFACT_DIR, "real_system_profile_preview.png");
    await page.screenshot({ path: profilePath, fullPage: false });
    console.log("SUCCESS_REAL_PROFILE:", profilePath);
  } catch (e) {
    console.warn("Profile open err:", e);
  }

  // 2. Mobile Viewport (< 768px) Clean Bottom Nav
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto("http://localhost:3000", { timeout: 30000 });
  await mobilePage.waitForTimeout(1500);

  try {
    const isLandingMob = await mobilePage.$('button:has-text("ทดลองเล่น Live Demo ทันที")');
    if (isLandingMob) {
      await mobilePage.click('button:has-text("ทดลองเล่น Live Demo ทันที")', { timeout: 3000 });
      await mobilePage.waitForTimeout(1500);
    }
  } catch (e) {}

  const mobileNavPath = path.join(ARTIFACT_DIR, "clean_mobile_bottom_nav_preview.png");
  await mobilePage.screenshot({ path: mobileNavPath, fullPage: false });
  console.log("SUCCESS_CLEAN_MOBILE_NAV:", mobileNavPath);

  await browser.close();
})();
