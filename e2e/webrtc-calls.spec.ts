import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Phase 3: WebRTC Calls & Enhancements Verification", () => {
  test("Tests Video/Audio Call launch, Live Call Duration Timer, and Hangup Workflow", async ({
    page,
  }) => {
    const artifactDir =
      "C:/Users/armyn/.gemini/antigravity-ide/brain/742993f7-9e54-451f-8d01-6551bad41c1b";

    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Load App
    await page.goto("http://localhost:3000");

    // 2. Wait for login button or sidebar
    const quickLogin = page.locator("[data-testid='quick-login-sarah']");
    const sidebar = page.locator("[data-testid='left-navigation-sidebar']");

    await expect(quickLogin.or(sidebar)).toBeVisible({ timeout: 15000 });

    if (await quickLogin.isVisible()) {
      await quickLogin.click();
      await expect(sidebar).toBeVisible({ timeout: 10000 });
    }

    // 3. Select Contact Alex Dev
    const alexContact = page.getByTestId("contact-item-alex");
    await expect(alexContact).toBeVisible({ timeout: 10000 });
    await alexContact.click();
    await page.waitForTimeout(500);

    // 4. Click Video Call button in Chat Header
    const videoCallBtn = page.getByTestId("chat-header-video-call-btn");
    await expect(videoCallBtn).toBeVisible();
    await videoCallBtn.click();

    // 5. Verify LiveKit Meeting Container is displayed
    const meetingContainer = page.getByTestId("livekit-meeting-container");
    await expect(meetingContainer).toBeVisible({ timeout: 15000 });

    // 6. Verify Call Duration Timer exists and is running
    const timer = page.getByTestId("call-duration-timer");
    await expect(timer).toBeVisible();
    await page.waitForTimeout(3000);

    // 7. Capture High-Res Screenshot for Inspection
    await page.screenshot({
      path: path.join(artifactDir, "webrtc_call_overview.png"),
      fullPage: false,
    });

    // 8. Test Hangup Call
    const hangupBtn = page.getByTestId("hangup-call-btn");
    await expect(hangupBtn).toBeVisible();
    await hangupBtn.click();
    await page.waitForTimeout(1000);

    // 9. Verify Meeting Container is closed and returned to Dashboard
    await expect(meetingContainer).not.toBeVisible();
    await expect(sidebar).toBeVisible();
  });
});
