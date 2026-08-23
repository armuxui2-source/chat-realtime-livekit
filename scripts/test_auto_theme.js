const { chromium } = require("playwright");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Clear any existing localStorage theme so it starts fresh in Auto mode
  await page.addInitScript(() => {
    localStorage.removeItem("ticketapp_theme_mode");
  });

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Quick Login
  const quickLoginBtn = page.locator('[data-testid="hero-quick-demo-btn"]');
  if ((await quickLoginBtn.count()) > 0) {
    await quickLoginBtn.click();
    await page.waitForTimeout(2000);
  }

  const currentTheme = await page.evaluate(() => {
    return document.documentElement.getAttribute("data-theme");
  });

  console.log("Current Auto Resolved Theme at 10:15 AM is:", currentTheme);

  const autoDaylightScreenshot = path.join(__dirname, "..", "auto_daylight_10am_preview.png");
  await page.screenshot({ path: autoDaylightScreenshot });
  console.log("Saved screenshot to", autoDaylightScreenshot);

  await browser.close();
}

main().catch(console.error);
