import { test, expect } from "@playwright/test";

test.describe("Real-time Chat & LiveKit Meet E2E Workflow", () => {
  test("Complete login, messaging, contact switching, and LiveKit Meet room launch", async ({
    page,
  }) => {
    // 1. Visit app
    await page.goto("http://localhost:3000");

    // 2. Select Quick Login: Sarah Miller
    const quickLoginBtn = page.getByTestId("quick-login-sarah");
    if (await quickLoginBtn.isVisible()) {
      await quickLoginBtn.click();
      await page.waitForTimeout(500);
    }

    // 3. Verify logged in status
    await expect(page.getByTestId("left-navigation-sidebar")).toBeVisible({ timeout: 10000 });

    // 4. Select Contact: Alex Dev
    const alexContact = page.getByTestId("contact-item-alex");
    await expect(alexContact).toBeVisible();
    await alexContact.click();

    // 5. Verify Chat Header
    await expect(page.getByTestId("chat-header-display-name")).toContainText("Alex Dev");

    // 6. Send message
    const msgInput = page.getByTestId("message-textarea");
    await msgInput.fill("สวัสดีครับ Alex ทดสอบระบบ Real-time Chat!");
    await page.getByTestId("send-message-btn").click();

    // 7. Verify Voice & Video call buttons exist
    await expect(page.getByTestId("chat-header-audio-call-btn")).toBeVisible();
    await expect(page.getByTestId("chat-header-video-call-btn")).toBeVisible();

    // 8. Test LiveKit Meet Room Creation
    const openMeetModalBtn = page.getByTestId("quick-create-meet-room-btn");
    await openMeetModalBtn.click();

    const roomInput = page.getByTestId("room-name-input");
    await expect(roomInput).toBeVisible();
    await roomInput.fill("e2e-livekit-test-room");

    const joinRoomBtn = page.getByTestId("join-room-confirm-btn");
    await joinRoomBtn.click();

    // 9. Verify LiveKit Meeting Room Container is rendered
    await expect(page.getByTestId("livekit-meeting-container")).toBeVisible({ timeout: 15000 });
  });
});
