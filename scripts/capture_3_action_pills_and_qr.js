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

  // 1. Open Profile & Check the 3 Quick Action Pills (Search, Link, QR Code)
  await page.click('[data-testid="open-edit-profile-btn"]', { timeout: 3000 });
  await page.waitForTimeout(800);
  const pillsPath = path.join(ARTIFACT_DIR, "profile_3_action_pills_preview.png");
  await page.screenshot({ path: pillsPath, fullPage: false });
  console.log("SUCCESS_3_ACTION_PILLS:", pillsPath);

  // 2. Click QR Code Pill (Button 3)
  await page.click('button:has-text("คิวอาร์โค้ด")', { timeout: 3000 });
  await page.waitForTimeout(800);
  const qrPath = path.join(ARTIFACT_DIR, "profile_qr_code_card_preview.png");
  await page.screenshot({ path: qrPath, fullPage: false });
  console.log("SUCCESS_QR_CODE_CARD:", qrPath);

  // 3. Click Back & Click Activity / Notification Bell
  await page.click('[data-testid="instagram-profile-drawer"] button[title="ย้อนกลับ"]', { timeout: 3000 });
  await page.waitForTimeout(500);
  await page.click('button[title="กิจกรรม & การแจ้งเตือน"]', { timeout: 3000 });
  await page.waitForTimeout(800);
  const activityPath = path.join(ARTIFACT_DIR, "activity_social_feed_preview.png");
  await page.screenshot({ path: activityPath, fullPage: false });
  console.log("SUCCESS_ACTIVITY_FEED:", activityPath);

  await browser.close();
})();
