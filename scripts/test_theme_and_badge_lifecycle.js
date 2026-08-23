const { chromium } = require("playwright");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Quick Login
  const quickLoginBtn = page.locator('[data-testid="hero-quick-demo-btn"]');
  if ((await quickLoginBtn.count()) > 0) {
    await quickLoginBtn.click();
    await page.waitForTimeout(2000);
  }

  // 2. Open Profile Drawer to show Theme Switcher
  const editProfileBtn = page.locator('[data-testid="open-edit-profile-btn"]');
  await editProfileBtn.waitFor({ state: "visible", timeout: 5000 });
  await editProfileBtn.click();
  await page.waitForTimeout(600);

  const themeDrawerPath = path.join(__dirname, "..", "theme_switcher_preview.png");
  await page.screenshot({ path: themeDrawerPath });
  console.log("Captured theme switcher drawer preview to", themeDrawerPath);

  // 3. Switch to Light Mode
  const lightModeBtn = page.locator('button:has-text("สว่าง (Day)")');
  if ((await lightModeBtn.count()) > 0) {
    await lightModeBtn.click();
    await page.waitForTimeout(600);
    const lightModePath = path.join(__dirname, "..", "light_mode_full_preview.png");
    await page.screenshot({ path: lightModePath });
    console.log("Captured light mode full preview to", lightModePath);
  }

  // 4. Switch back to Dark Mode for persistence
  const darkModeBtn = page.locator('button:has-text("มืด (Night)")');
  if ((await darkModeBtn.count()) > 0) {
    await darkModeBtn.click();
    await page.waitForTimeout(500);
  }

  await browser.close();
}

main().catch(console.error);
