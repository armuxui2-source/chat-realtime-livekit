const { chromium } = require("playwright");
const path = require("path");

const ARTIFACT_DIR =
  "C:\\Users\\armyn\\.gemini\\antigravity-ide\\brain\\c41c62cc-120d-42ff-9c07-c23b52b92fd8";

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Capture Split Hero Auth Modal
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { timeout: 30000 });
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(1500);

    const authPath = path.join(ARTIFACT_DIR, "split_hero_auth_preview.png");
    await page.screenshot({ path: authPath, fullPage: false });
    console.log("SUCCESS_AUTH_SCREENSHOT:", authPath);
    await context.close();
  }

  // 2. Capture Desktop 3-Column Tri-Pane View (Login via Sarah Miller)
  {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { timeout: 30000 });
    await page.waitForTimeout(1500);

    // Switch to 'quick' tab and click Sarah Miller
    try {
      await page.click('button:has-text("ทดสอบ")', { timeout: 2000 });
      await page.waitForTimeout(500);
      await page.click('button:has-text("Sarah Miller")', { timeout: 3000 });
    } catch (e) {}
    await page.waitForTimeout(1500);

    const desktopPath = path.join(ARTIFACT_DIR, "desktop_3_column_preview.png");
    await page.screenshot({ path: desktopPath, fullPage: false });
    console.log("SUCCESS_DESKTOP_SCREENSHOT:", desktopPath);

    // 3. Open Right Panel Edit Profile Mode
    try {
      await page.click('[data-testid="open-edit-profile-btn"]', { timeout: 3000 });
      await page.waitForTimeout(800);
      const editPath = path.join(ARTIFACT_DIR, "right_panel_edit_preview.png");
      await page.screenshot({ path: editPath, fullPage: false });
      console.log("SUCCESS_EDIT_SCREENSHOT:", editPath);
    } catch (e) {
      console.warn("Edit err:", e);
    }

    // 4. Open Right Panel Call History Mode
    try {
      await page.click('[data-testid="open-call-history-btn"]', { timeout: 3000 });
      await page.waitForTimeout(800);
      const callHistPath = path.join(ARTIFACT_DIR, "right_panel_call_history_preview.png");
      await page.screenshot({ path: callHistPath, fullPage: false });
      console.log("SUCCESS_CALL_HIST_SCREENSHOT:", callHistPath);
    } catch (e) {
      console.warn("Call hist err:", e);
    }

    await context.close();
  }

  // 5. Capture Mobile Viewport (< 768px) with Permanent Bottom Navigation
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000", { timeout: 30000 });
    await page.waitForTimeout(1500);

    const mobilePath = path.join(ARTIFACT_DIR, "mobile_bottom_nav_preview.png");
    await page.screenshot({ path: mobilePath, fullPage: false });
    console.log("SUCCESS_MOBILE_SCREENSHOT:", mobilePath);
    await context.close();
  }

  await browser.close();
})();
