const { chromium } = require('@playwright/test');

(async () => {
  try {
    console.log("🚀 Starting Headed Browser with headless: false...");
    const browser = await chromium.launch({
      headless: false,
      args: ['--start-maximized', '--disable-blink-features=AutomationControlled']
    });
    
    const context = await browser.newContext({
      viewport: null,
      locale: 'th-TH',
    });
    
    const page = await context.newPage();
    console.log("🌐 Navigating to http://localhost:3000 ...");
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
    console.log("✅ Headed browser successfully opened and loaded http://localhost:3000");
    
    // Auto login demo account for instant visual preview
    try {
      const sarahBtn = await page.waitForSelector('button:has-text("Sarah Miller")', { timeout: 5000 });
      if (sarahBtn) {
        await sarahBtn.click();
        console.log("✅ Auto-selected profile Sarah Miller");
      }
    } catch (e) {
      console.log("Note: Profile selection modal already passed or skipped");
    }

    // Keep window open
    console.log("🟢 Browser window is now open on your screen.");
    await new Promise(() => {});
  } catch (err) {
    console.error("❌ Headed Browser Error:", err);
    process.exit(1);
  }
})();
