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

  // 1. Open Profile Overview (No red logout button)
  await page.click('[data-testid="open-edit-profile-btn"]', { timeout: 3000 });
  await page.waitForTimeout(800);
  const profilePath = path.join(ARTIFACT_DIR, "clean_profile_no_logout_preview.png");
  await page.screenshot({ path: profilePath, fullPage: false });
  console.log("SUCCESS_CLEAN_PROFILE:", profilePath);

  // 2. Click Notifications Hub
  await page.click('button:has-text("ศูนย์การแจ้งเตือน & เสียง")', { timeout: 3000 });
  await page.waitForTimeout(800);
  const notifPath = path.join(ARTIFACT_DIR, "notifications_hub_preview.png");
  await page.screenshot({ path: notifPath, fullPage: false });
  console.log("SUCCESS_NOTIF_HUB:", notifPath);

  // 3. Click Back in Drawer & Click Privacy & Account (with safely placed logout at bottom)
  await page.click('[data-testid="instagram-profile-drawer"] button[title="ย้อนกลับ"]', { timeout: 3000 });
  await page.waitForTimeout(500);
  await page.click('button:has-text("ความเป็นส่วนตัว & บัญชี")', { timeout: 3000 });
  await page.waitForTimeout(800);
  const privacyPath = path.join(ARTIFACT_DIR, "privacy_and_logout_preview.png");
  await page.screenshot({ path: privacyPath, fullPage: false });
  console.log("SUCCESS_PRIVACY_LOGOUT:", privacyPath);

  await browser.close();
})();
