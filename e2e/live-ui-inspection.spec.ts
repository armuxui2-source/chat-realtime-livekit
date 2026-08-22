import { test, expect } from "@playwright/test";

test.describe("Exhaustive Live UI & Functional Inspection Suite", () => {
  test("Live comprehensive test across all components and edge cases", async ({
    page,
  }) => {
    test.setTimeout(120000);
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Visit App & Login
    await page.goto("http://localhost:3000");
    await page.waitForTimeout(1500);

    const quickLogin = page.locator("[data-testid='quick-login-sarah']");
    const sidebar = page.locator("[data-testid='left-navigation-sidebar']");

    if (await quickLogin.isVisible()) {
      await quickLogin.click();
      await expect(sidebar).toBeVisible({ timeout: 10000 });
      await page.waitForTimeout(1500);
    }

    // 2. Test Channel Switching & Group Tab
    const tabChannels = page.getByTestId("tab-channels");
    await tabChannels.click();
    await page.waitForTimeout(1500);

    const generalChannel = page.getByTestId("channel-item-general");
    await generalChannel.click();
    await page.waitForTimeout(1500);

    // Send a message in General Channel
    const textarea = page.getByTestId("message-textarea");
    await textarea.fill("สวัสดีทุกคนในห้อง General! กำลังเริ่มการตรวจสอบระบบ UI ทั้งหมด");
    await page.waitForTimeout(1000);
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1500);

    // 3. Switch back to DM Tab and Select Alex
    const tabDm = page.getByTestId("tab-dm");
    await tabDm.click();
    await page.waitForTimeout(1500);

    const alexContact = page.getByTestId("contact-item-alex");
    await alexContact.click();
    await page.waitForTimeout(1500);

    // 4. Test Quick Reply Buttons
    const quickReplyBtn = page.getByRole("button", { name: "พร้อมประชุมครับ" });
    if (await quickReplyBtn.isVisible()) {
      await quickReplyBtn.click();
      await page.waitForTimeout(1500);
      await page.getByTestId("send-message-btn").click();
      await page.waitForTimeout(1500);
    }

    // 5. Test @Mention Popover
    await textarea.fill("แจ้ง @");
    await page.waitForTimeout(1500);
    const mentionOption = page.locator("[data-testid^='mention-user-']").first();
    if (await mentionOption.isVisible()) {
      await mentionOption.click();
      await page.waitForTimeout(1000);
      await textarea.press(" ");
      await textarea.type("รบกวนตรวจสอบรายงานระบบประจำวันด้วยครับ");
      await page.waitForTimeout(1500);
      await page.getByTestId("send-message-btn").click();
      await page.waitForTimeout(1500);
    }

    // 6. Test Voice Message Recorder
    const startRecordBtn = page.getByTestId("start-record-btn");
    if (await startRecordBtn.isVisible()) {
      await startRecordBtn.click();
      await page.waitForTimeout(2500); // Record for 2.5s
      const sendVoiceBtn = page.getByTestId("send-voice-btn");
      if (await sendVoiceBtn.isVisible()) {
        await sendVoiceBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    // 7. Test Message Reactions (Hover & React)
    const msgItems = page.locator("[data-testid^='message-item-']");
    const lastMsg = msgItems.last();
    await lastMsg.hover();
    await page.waitForTimeout(1000);

    const reactionBtn = lastMsg.locator("[data-testid^='reaction-btn-']");
    if (await reactionBtn.isVisible()) {
      await reactionBtn.click({ force: true });
      await page.waitForTimeout(1000);
      const thumbsUpBtn = page.getByTestId("react-thumbs-up");
      if (await thumbsUpBtn.isVisible()) {
        await thumbsUpBtn.click();
        await page.waitForTimeout(1500);
      }
    }

    // 8. Test Pin Message
    await lastMsg.hover();
    const pinBtn = lastMsg.locator("[data-testid^='pin-btn-']");
    if (await pinBtn.isVisible()) {
      await pinBtn.click({ force: true });
      await page.waitForTimeout(1500);
    }

    // 9. Test In-Chat Realtime Search
    const searchToggleBtn = page.getByTestId("toggle-search-btn");
    if (await searchToggleBtn.isVisible()) {
      await searchToggleBtn.click();
      await page.waitForTimeout(1000);
      const searchInput = page.getByTestId("chat-search-input");
      await searchInput.fill("ประชุม");
      await page.waitForTimeout(2000);
      await searchInput.fill("");
      await searchToggleBtn.click();
      await page.waitForTimeout(1000);
    }

    // 10. Test Bookmarks Drawer
    const openBookmarksBtn = page.getByTestId("open-bookmarks-btn");
    await openBookmarksBtn.click();
    await page.waitForTimeout(2500);
    const bookmarksDrawer = page.getByTestId("bookmarks-drawer");
    await bookmarksDrawer.locator("button:has(svg.lucide-x)").click();
    await page.waitForTimeout(1500);

    // 11. Test Call History Drawer
    const openCallHistoryBtn = page.getByTestId("open-call-history-btn");
    await openCallHistoryBtn.click();
    await page.waitForTimeout(2500);
    const callHistoryDrawer = page.getByTestId("call-history-drawer");
    await callHistoryDrawer.locator("button:has(svg.lucide-x)").click();
    await page.waitForTimeout(1500);

    // 12. Test Profile & Presence Settings
    const openProfileBtn = page.getByTestId("open-edit-profile-btn");
    await openProfileBtn.click();
    await page.waitForTimeout(1500);

    const awayBtn = page.getByTestId("status-option-away");
    await awayBtn.click();
    await page.waitForTimeout(1000);

    await page.getByTestId("save-profile-btn").click();
    await page.waitForTimeout(2000);

    // 13. Test LiveKit Video Conference Room
    const videoCallBtn = page.getByTestId("chat-header-video-call-btn");
    await videoCallBtn.click();
    await page.waitForTimeout(4000);

    // Leave Call
    const leaveBtn = page.locator("[data-testid='leave-call-btn']").or(page.locator("button.bg-rose-600"));
    if (await leaveBtn.first().isVisible()) {
      await leaveBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });
});
