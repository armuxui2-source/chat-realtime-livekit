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

  // 1. Open Profile & Check Monochrome Icons
  await page.click('[data-testid="open-edit-profile-btn"]', { timeout: 3000 });
  await page.waitForTimeout(800);
  const profileMonoPath = path.join(ARTIFACT_DIR, "apple_monochrome_profile_preview.png");
  await page.screenshot({ path: profileMonoPath, fullPage: false });
  console.log("SUCCESS_APPLE_MONOCHROME_PROFILE:", profileMonoPath);

  // 2. Open Notifications Hub & Check Monochrome Icons
  await page.click('button:has-text("ศูนย์การแจ้งเตือน & เสียง")', { timeout: 3000 });
  await page.waitForTimeout(800);
  const notifMonoPath = path.join(ARTIFACT_DIR, "apple_monochrome_notifications_preview.png");
  await page.screenshot({ path: notifMonoPath, fullPage: false });
  console.log("SUCCESS_APPLE_MONOCHROME_NOTIF:", notifMonoPath);

  // 3. Open Privacy & Account & Check Monochrome Icons
  await page.click('[data-testid="instagram-profile-drawer"] button[title="ย้อนกลับ"]', { timeout: 3000 });
  await page.waitForTimeout(500);
  await page.click('button:has-text("ความเป็นส่วนตัว & บัญชี")', { timeout: 3000 });
  await page.waitForTimeout(800);
  const privacyMonoPath = path.join(ARTIFACT_DIR, "apple_monochrome_privacy_preview.png");
  await page.screenshot({ path: privacyMonoPath, fullPage: false });
  console.log("SUCCESS_APPLE_MONOCHROME_PRIVACY:", privacyMonoPath);

  await browser.close();
})();
