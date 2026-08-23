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

  // 1. Capture Main Dashboard with WhatsApp Dark Gunmetal Theme + Frosted Emerald Glass
  const dashPath = path.join(ARTIFACT_DIR, "whatsapp_dark_gunmetal_dashboard.png");
  await page.screenshot({ path: dashPath, fullPage: false });
  console.log("SUCCESS_DASHBOARD:", dashPath);

  // 2. Open Profile Drawer with Figma Frosted Glass Spec & 3 Quick Pills
  try {
    const profileBtn = await page.$('[data-testid="user-profile-button"]') || await page.$('[data-testid="open-edit-profile-btn"]');
    if (profileBtn) {
      await profileBtn.click();
      await page.waitForTimeout(800);
      const profilePath = path.join(ARTIFACT_DIR, "frosted_emerald_profile_drawer.png");
      await page.screenshot({ path: profilePath, fullPage: false });
      console.log("SUCCESS_PROFILE_DRAWER:", profilePath);

      // 3. Open QR Code Card (Figma Glass Spec)
      const qrBtn = await page.$('button:has-text("คิวอาร์โค้ด")');
      if (qrBtn) {
        await qrBtn.click();
        await page.waitForTimeout(800);
        const qrPath = path.join(ARTIFACT_DIR, "figma_spec_glass_qr_card.png");
        await page.screenshot({ path: qrPath, fullPage: false });
        console.log("SUCCESS_QR_CARD:", qrPath);
      }
    }
  } catch (e) {
    console.error("Profile click error:", e);
  }

  await browser.close();
})();
