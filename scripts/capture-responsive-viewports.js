const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  
  // Test Mobile (iPhone 14 - 390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForTimeout(2000);

  const screenshotPathMobile = path.join('C:\\Users\\armyn\\.gemini\\antigravity-ide\\brain\\742993f7-9e54-451f-8d01-6551bad41c1b', 'mobile_view_before.png');
  await mobilePage.screenshot({ path: screenshotPathMobile, fullPage: true });
  console.log('Mobile screenshot saved:', screenshotPathMobile);

  // Test Tablet (iPad - 768x1024)
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto('http://localhost:3000');
  await tabletPage.waitForTimeout(2000);

  const screenshotPathTablet = path.join('C:\\Users\\armyn\\.gemini\\antigravity-ide\\brain\\742993f7-9e54-451f-8d01-6551bad41c1b', 'tablet_view_before.png');
  await tabletPage.screenshot({ path: screenshotPathTablet, fullPage: true });
  console.log('Tablet screenshot saved:', screenshotPathTablet);

  await browser.close();
})();
