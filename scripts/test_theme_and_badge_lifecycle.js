const { chromium } = require("playwright");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Quick Login
  const quickLoginBtn = page.locator('[data-testid="hero-quick-demo-btn"]');
  if ((await quickLoginBtn.count()) > 0) {
    await quickLoginBtn.click();
    await page.waitForTimeout(2000);
  }

  // 1. Capture Dark Mode
  const darkModePath = path.join(__dirname, "..", "dark_mode_full_preview.png");
  await page.screenshot({ path: darkModePath });
  console.log("Captured dark mode full preview to", darkModePath);

  // 2. Open Profile Drawer & Switch to Light Mode
  const editProfileBtn = page.locator('[data-testid="user-profile-button"]');
  if ((await editProfileBtn.count()) > 0) {
    await editProfileBtn.click();
    await page.waitForTimeout(600);

    const lightModeBtn = page.locator('button:has-text("สว่าง (Day)")');
    if ((await lightModeBtn.count()) > 0) {
      await lightModeBtn.click();
      await page.waitForTimeout(600);

      // Close drawer to see main chat in Light Mode
      const closeBtn = page.locator('button[title="ปิดหน้าต่าง"]');
      if ((await closeBtn.count()) > 0) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }

      const lightModePath = path.join(__dirname, "..", "light_mode_full_preview.png");
      await page.screenshot({ path: lightModePath });
      console.log("Captured light mode full preview to", lightModePath);
    }
  }

  await browser.close();
}

main().catch(console.error);
