const { chromium } = require('playwright');
const path = require('path');

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1500, height: 950 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Quick login
  const quickLoginBtn = page.locator('[data-testid="quick-login-alex"]');
  if (await quickLoginBtn.isVisible()) {
    await quickLoginBtn.click();
    await page.waitForSelector('[data-testid="main-dashboard"]', { timeout: 10000 });
  }

  // Select Sarah Miller
  const sarahContact = page.locator('[data-testid="contact-item-sarah"]');
  if (await sarahContact.isVisible()) {
    await sarahContact.click();
    await page.waitForTimeout(500);
  }

  // Send a message to see the chat bubble
  const textarea = page.locator('[data-testid="message-textarea"]');
  if (await textarea.isVisible()) {
    await textarea.fill('สวัสดีครับคุณ Sarah ดีไซน์หน้าแชทธีม Modern Soft-Light Glassmorphic ปรับแต่งเสร็จสมบูรณ์แล้วครับ!');
    await page.locator('[data-testid="send-message-btn"]').click();
    await page.waitForTimeout(1000);
  }

  // Take full desktop screenshot
  const screenshotPath = path.resolve('C:/Users/armyn/.gemini/antigravity-ide/brain/742993f7-9e54-451f-8d01-6551bad41c1b/theme_redesign_overview.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`Updated screenshot saved to: ${screenshotPath}`);

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
