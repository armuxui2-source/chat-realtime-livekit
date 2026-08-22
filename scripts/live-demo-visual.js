const { chromium } = require("playwright");

(async () => {
  console.log("🚀 กำลังเปิด Google Chrome จริงบนหน้าจอ...");

  const browser = await chromium.launch({
    headless: false,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    slowMo: 1000, // ชะลอจังหวะให้มองเห็นการคลิกและพิมพ์ชัดเจน
    args: ["--start-maximized", "--no-sandbox"],
  });

  const context = await browser.newContext({
    viewport: null, // ใช้ขนาดเต็มหน้าต่างจริง
  });

  const page = await context.newPage();

  console.log("🌐 กำลังเข้าสู่ http://localhost:3000");
  await page.goto("http://localhost:3000");
  await page.waitForTimeout(2000);

  // 1. Quick Login
  const quickLogin = page.locator("[data-testid='quick-login-sarah']");
  if (await quickLogin.isVisible()) {
    console.log("🔑 คลิกเข้าสู่ระบบด้วย Sarah Miller");
    await quickLogin.click();
    await page.waitForTimeout(2500);
  }

  // 2. Select Alex Dev
  console.log("💬 เลือกผู้ติดต่อ Alex Dev");
  const alex = page.locator("[data-testid='contact-item-alex']");
  await alex.click();
  await page.waitForTimeout(2000);

  // 3. Send Message with Code and Link
  console.log("✍️ กำลังพิมพ์ข้อความตัวอย่างพร้อมโค้ดและลิงก์...");
  const textarea = page.locator("[data-testid='message-textarea']");
  await textarea.fill(
    "สวัสดีครับ Alex! นี่คือการสาธิตระบบแชทสดๆ ต่อหน้าคุณ\n```typescript\nconst client = new LiveKitClient({ room: 'general' });\n```\nhttps://livekit.io"
  );
  await page.waitForTimeout(2000);
  await page.locator("[data-testid='send-message-btn']").click();
  await page.waitForTimeout(2500);

  // 4. Open Bookmarks Drawer
  console.log("🔖 เปิดแผงข้อความที่บันทึกไว้ (Bookmarks)");
  await page.locator("[data-testid='open-bookmarks-btn']").click();
  await page.waitForTimeout(3000);
  await page.locator("[data-testid='bookmarks-drawer'] button:has(svg.lucide-x)").click();
  await page.waitForTimeout(2000);

  // 5. Open Call History Drawer
  console.log("📞 เปิดแผงประวัติการโทร (Call History)");
  await page.locator("[data-testid='open-call-history-btn']").click();
  await page.waitForTimeout(3000);
  await page.locator("[data-testid='call-history-drawer'] button:has(svg.lucide-x)").click();
  await page.waitForTimeout(2000);

  // 6. Test LiveKit Video Meeting Room
  console.log("🎥 เปิดห้องวิดีโอคอล LiveKit Meet");
  await page.locator("[data-testid='chat-header-video-call-btn']").click();
  await page.waitForTimeout(5000);

  console.log("🔴 วางสายและกลับสู่หน้าแชท");
  const leaveBtn = page.locator("[data-testid='leave-call-btn']").or(page.locator("button.bg-rose-600"));
  if (await leaveBtn.first().isVisible()) {
    await leaveBtn.first().click();
    await page.waitForTimeout(2000);
  }

  console.log("✅ การสาธิตเสร็จสมบูรณ์! หน้าต่างเบราว์เซอร์จะเปิดค้างไว้ให้คุณทดลองใช้งานต่อ");
  // ไม่ปิด browser เพื่อให้ผู้ใช้สามารถคลิกเล่นต่อได้ทันที
})();
