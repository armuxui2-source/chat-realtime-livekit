const { chromium } = require("playwright");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const artifactDir = "C:\\\\Users\\\\armyn\\\\.gemini\\\\antigravity-ide\\\\brain\\\\c41c62cc-120d-42ff-9c07-c23b52b92fd8";

  console.log("Navigating to app...");
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // 1. Desktop Viewport (1440x900)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, "final_master_desktop_3_column.png") });
  console.log("Captured desktop 3-column");

  // 2. Open Profile Drawer & QR Card
  const profileTab = page.locator('button:has-text("โปรไฟล์")').first();
  if (await profileTab.count() > 0) {
    await profileTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(artifactDir, "final_master_profile_drawer.png") });
    console.log("Captured profile drawer");

    // Click QR code action pill
    const qrPill = page.locator('button:has-text("คิวอาร์โค้ด")').first();
    if (await qrPill.count() > 0) {
      await qrPill.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(artifactDir, "final_master_qr_code_card.png") });
      console.log("Captured QR code card");
    }
  }

  // 3. Mobile Viewport (390x844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, "final_master_mobile_capsule.png") });
  console.log("Captured mobile capsule view");

  await browser.close();
  console.log("ALL_CAPTURES_COMPLETE");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
