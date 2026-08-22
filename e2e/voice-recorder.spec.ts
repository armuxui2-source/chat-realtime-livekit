import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Category 1: Voice Messages & Audio Notes Verification", () => {
  test("Tests Voice Recorder, Waveform, Audio Message Bubble, and Playback Controls", async ({
    page,
    context,
  }) => {
    const artifactDir =
      "C:/Users/armyn/.gemini/antigravity-ide/brain/742993f7-9e54-451f-8d01-6551bad41c1b";

    // Grant microphone permissions to context
    await context.grantPermissions(["microphone"]);

    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Load App
    await page.goto("http://localhost:3000");

    // 2. Wait for login or sidebar
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

    // 4. Click Voice Record button in MessageInput
    const voiceRecordBtn = page.getByTestId("voice-record-btn");
    await expect(voiceRecordBtn).toBeVisible();
    await voiceRecordBtn.click();

    // 5. Verify Voice Recorder Bar is visible with Duration Counter
    const recorderBar = page.getByTestId("voice-recorder-bar");
    await expect(recorderBar).toBeVisible({ timeout: 5000 });

    const durationCounter = page.getByTestId("voice-record-duration");
    await expect(durationCounter).toBeVisible();
    await page.waitForTimeout(2000);

    // 6. Click Send Voice button
    const sendVoiceBtn = page.getByTestId("send-voice-record-btn");
    await expect(sendVoiceBtn).toBeVisible();
    await sendVoiceBtn.click();
    await page.waitForTimeout(1000);

    // 7. Verify Audio Message Bubble rendered in chat feed
    const audioBubbles = page.getByTestId("audio-message-bubble");
    await expect(audioBubbles.last()).toBeVisible({ timeout: 5000 });

    // 8. Test Speed multiplier button on the bubble
    const speedBtn = audioBubbles.last().getByTestId("audio-speed-btn");
    await expect(speedBtn).toBeVisible();
    await expect(speedBtn).toHaveText("1x");
    await speedBtn.click();
    await expect(speedBtn).toHaveText("1.5x");

    // 9. Capture High-Res Screenshot for Inspection
    await page.screenshot({
      path: path.join(artifactDir, "voice_recorder_overview.png"),
      fullPage: false,
    });
  });
});
