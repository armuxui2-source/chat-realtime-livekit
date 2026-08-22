const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\armyn\\.gemini\\antigravity-ide\\brain\\742993f7-9e54-451f-8d01-6551bad41c1b';

(async () => {
  const browser = await chromium.launch();

  // 1. Mobile (iPhone 14 - 390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000');
  await mobilePage.waitForTimeout(1000);

  // Login Alex
  await mobilePage.click('button:has-text("Alex Dev")');
  await mobilePage.waitForTimeout(1500);

  // Capture Mobile Conversations View
  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'mobile_1_conversations.png'),
    fullPage: true,
  });
  console.log('Saved mobile_1_conversations.png');

  // Click Sarah Miller to open Chat
  await mobilePage.click('button:has-text("Sarah Miller")');
  await mobilePage.waitForTimeout(1500);

  // Capture Mobile Chat View
  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'mobile_2_chat_feed.png'),
    fullPage: true,
  });
  console.log('Saved mobile_2_chat_feed.png');

  // Click Details Panel Info Button on Mobile
  await mobilePage.click('[data-testid="toggle-details-panel-btn"]');
  await mobilePage.waitForTimeout(1500);

  // Capture Mobile Details Panel View
  await mobilePage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'mobile_3_details_panel.png'),
    fullPage: true,
  });
  console.log('Saved mobile_3_details_panel.png');

  // 2. Tablet (iPad - 768x1024)
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto('http://localhost:3000');
  await tabletPage.waitForTimeout(1000);
  await tabletPage.click('button:has-text("Alex Dev")');
  await tabletPage.waitForTimeout(1500);
  await tabletPage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'tablet_view_responsive.png'),
    fullPage: true,
  });
  console.log('Saved tablet_view_responsive.png');

  // 3. Desktop (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:3000');
  await desktopPage.waitForTimeout(1000);
  await desktopPage.click('button:has-text("Alex Dev")');
  await desktopPage.waitForTimeout(1500);
  await desktopPage.screenshot({
    path: path.join(ARTIFACTS_DIR, 'desktop_view_responsive.png'),
    fullPage: true,
  });
  console.log('Saved desktop_view_responsive.png');

  await browser.close();
})();
