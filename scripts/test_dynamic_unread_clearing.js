const { chromium } = require("playwright");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Quick Login as Sarah
  const quickLoginBtn = page.locator('[data-testid="hero-quick-demo-btn"]');
  if ((await quickLoginBtn.count()) > 0) {
    await quickLoginBtn.click();
    await page.waitForTimeout(2000);
  }

  console.log("Checking initial unread badge on Somchai...");
  const somchaiItem = page.locator('[data-testid="contact-item-somchai"]');
  await somchaiItem.waitFor({ state: "visible", timeout: 5000 });

  // Click on Somchai to open chat & mark as read
  console.log("Clicking Somchai to read messages...");
  await somchaiItem.click();
  await page.waitForTimeout(1000);

  const screenshotPath = path.join(__dirname, "..", "dynamic_unread_cleared_preview.png");
  await page.screenshot({ path: screenshotPath });
  console.log("Captured dynamic read state preview to", screenshotPath);

  await browser.close();
}

main().catch(console.error);
