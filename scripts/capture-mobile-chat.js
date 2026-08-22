const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  
  // Mobile (iPhone 14)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);

  // Click Quick Login Alex
  await page.click('button:has-text("Alex Dev")');
  await page.waitForTimeout(1500);

  const mobileDashboard = path.join('C:\\Users\\armyn\\.gemini\\antigravity-ide\\brain\\742993f7-9e54-451f-8d01-6551bad41c1b', 'mobile_logged_in_dashboard.png');
  await page.screenshot({ path: mobileDashboard, fullPage: true });
  console.log('Logged in mobile saved:', mobileDashboard);

  await browser.close();
})();
