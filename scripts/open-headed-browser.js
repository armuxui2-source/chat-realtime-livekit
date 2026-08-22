const { chromium } = require("playwright");

(async () => {
  try {
    console.log("🚀 Starting Visible Headed Browser window...");
    const browser = await chromium.launch({
      headless: false,
      args: [
        "--start-maximized",
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
      ],
    });

    const context = await browser.newContext({
      viewport: null,
      locale: "th-TH",
    });

    const page = await context.newPage();
    console.log("🌐 Loading http://localhost:3000 ...");
    await page.goto("http://localhost:3000", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    console.log("✅ Headed browser loaded successfully!");

    // Auto login demo account for instant visual preview
    try {
      const sarahBtn = await page.waitForSelector(
        'button:has-text("Sarah Miller")',
        { timeout: 5000 }
      );
      if (sarahBtn) {
        await sarahBtn.click();
        console.log("✅ Auto-selected profile Sarah Miller");
      }
    } catch (e) {
      console.log("Note: Profile selection modal already passed or skipped");
    }

    console.log("🟢 Visible Browser window is OPEN on your screen!");
    // Keep window alive indefinitely
    await new Promise(() => {});
  } catch (err) {
    console.error("❌ Browser Launch Error:", err);
  }
})();
