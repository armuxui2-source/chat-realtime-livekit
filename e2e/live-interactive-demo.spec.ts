import { test, expect } from "@playwright/test";

test.describe("Live On-Screen Headed Demonstration", () => {
  test("Demonstrates complete Chat & WebRTC suite on visible browser", async ({
    page,
  }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width: 1440, height: 900 });

    // Step 1: Open Application
    await page.goto("http://localhost:3000");
    await page.waitForTimeout(2000);

    // Step 2: Quick Login as Sarah Miller
    const quickLogin = page.locator("[data-testid='quick-login-sarah']");
    const sidebar = page.locator("[data-testid='left-navigation-sidebar']");

    if (await quickLogin.isVisible()) {
      await quickLogin.click();
      await expect(sidebar).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(2000);
    }

    // Step 3: Switch Presence Status to Busy
    const editProfileBtn = page.getByTestId("open-edit-profile-btn");
    await editProfileBtn.click();
    await page.waitForTimeout(1500);

    const busyBtn = page.getByTestId("status-option-busy");
    await busyBtn.click();
    await page.waitForTimeout(1000);

    await page.getByTestId("save-profile-btn").click();
    await page.waitForTimeout(2000);

    // Step 4: Open Chat with Alex Dev
    const alexContact = page.getByTestId("contact-item-alex");
    await alexContact.click();
    await page.waitForTimeout(2000);

    // Step 5: Send Text & Code Snippet & Link
    const textarea = page.getByTestId("message-textarea");
    await textarea.fill(
      "สวัสดีครับ Alex! นี่คือการสาธิตระบบแชทระดับมืออาชีพสดๆ บนหน้าจอจริง\n```typescript\nconst livekit = new LiveKitClient({ room: 'general' });\n```\nดูรายละเอียดที่ https://livekit.io"
    );
    await page.waitForTimeout(2000);
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(2500);

    // Step 6: Bookmark the Message
    const msgItems = page.locator("[data-testid^='message-item-']");
    const lastMsg = msgItems.last();
    await lastMsg.hover();
    await page.waitForTimeout(1000);

    const bookmarkBtn = lastMsg.locator("[data-testid^='bookmark-btn-']");
    await bookmarkBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // Step 7: Open Bookmarks Drawer
    const openBookmarksBtn = page.getByTestId("open-bookmarks-btn");
    await openBookmarksBtn.click();
    await page.waitForTimeout(3000);

    const bookmarksDrawer = page.getByTestId("bookmarks-drawer");
    await bookmarksDrawer.locator("button:has(svg.lucide-x)").click();
    await page.waitForTimeout(2000);

    // Step 8: Open Call History Drawer
    const openCallHistoryBtn = page.getByTestId("open-call-history-btn");
    await openCallHistoryBtn.click();
    await page.waitForTimeout(3000);

    const callHistoryDrawer = page.getByTestId("call-history-drawer");
    await callHistoryDrawer.locator("button:has(svg.lucide-x)").click();
    await page.waitForTimeout(2000);

    // Step 9: Launch LiveKit Video Conference Meet Room
    const videoCallBtn = page.getByTestId("chat-header-video-call-btn");
    await videoCallBtn.click();
    await page.waitForTimeout(4000);

    // Step 10: Hang up / Leave Call Room
    const leaveBtn = page.locator("[data-testid='leave-call-btn']").or(page.locator("button.bg-rose-600"));
    if (await leaveBtn.first().isVisible()) {
      await leaveBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });
});
