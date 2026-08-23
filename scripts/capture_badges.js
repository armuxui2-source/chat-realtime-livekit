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

  const screenshotPath = path.join(__dirname, "..", "notification_badges_preview.png");
  await page.screenshot({ path: screenshotPath });
  console.log("Captured notification badges preview to", screenshotPath);

  // Also capture mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const mobileScreenshotPath = path.join(__dirname, "..", "mobile_badges_preview.png");
  await page.screenshot({ path: mobileScreenshotPath });
  console.log("Captured mobile badges preview to", mobileScreenshotPath);

  await browser.close();
}

main().catch(console.error);
