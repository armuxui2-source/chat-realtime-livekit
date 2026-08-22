import { test } from "@playwright/test";
import path from "path";

test("Capture full visual inspection screenshots", async ({ page }) => {
  const artifactDir = "C:/Users/armyn/.gemini/antigravity-ide/brain/742993f7-9e54-451f-8d01-6551bad41c1b";

  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Visit app
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");

  // 2. Select Sarah Miller
  const quickLoginBtn = page.getByTestId("quick-login-sarah");
  if (await quickLoginBtn.isVisible()) {
    await quickLoginBtn.click();
    await page.waitForTimeout(500);
  }

  // 3. Select Alex Dev
  const alexContact = page.getByTestId("contact-item-alex");
  if (await alexContact.isVisible()) {
    await alexContact.click();
    await page.waitForTimeout(500);
  }

  // Capture Dashboard Overview
  await page.screenshot({
    path: path.join(artifactDir, "2_chat_dashboard.png"),
    fullPage: false,
  });

  // 4. Click Start LiveKit Meet Room
  const createRoomBtn = page.getByTestId("create-livekit-room-btn");
  if (await createRoomBtn.isVisible()) {
    await createRoomBtn.click();
    const roomInput = page.getByTestId("room-name-input");
    await roomInput.fill("design-review-room");
    await page.getByTestId("join-room-confirm-btn").click();
    await page.waitForTimeout(2000);

    // Capture LiveKit Meet Room
    await page.screenshot({
      path: path.join(artifactDir, "3_livekit_meet_room.png"),
      fullPage: false,
    });
  }
});
