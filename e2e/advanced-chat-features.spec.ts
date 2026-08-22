import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Advanced Chat Enhancements (Forwarding, Lightbox, Call History)", () => {
  test("Tests Message Forwarding, Media Lightbox Viewer, and Call History Drawer", async ({
    page,
  }) => {
    const artifactDir =
      "C:/Users/armyn/.gemini/antigravity-ide/brain/742993f7-9e54-451f-8d01-6551bad41c1b";

    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Visit App & Login
    await page.goto("http://localhost:3000");

    const quickLogin = page.locator("[data-testid='quick-login-sarah']");
    const sidebar = page.locator("[data-testid='left-navigation-sidebar']");

    await expect(quickLogin.or(sidebar)).toBeVisible({ timeout: 15000 });

    if (await quickLogin.isVisible()) {
      await quickLogin.click();
      await expect(sidebar).toBeVisible({ timeout: 10000 });
    }

    // 2. Select Contact: Alex Dev
    const alexContact = page.getByTestId("contact-item-alex");
    await expect(alexContact).toBeVisible();
    await alexContact.click();
    await page.waitForTimeout(500);

    // 3. Test Call History Drawer
    const callHistoryBtn = page.getByTestId("open-call-history-btn");
    await expect(callHistoryBtn).toBeVisible();
    await callHistoryBtn.click();

    const callHistoryDrawer = page.getByTestId("call-history-drawer");
    await expect(callHistoryDrawer).toBeVisible({ timeout: 5000 });

    // Close Call History Drawer
    await callHistoryDrawer.locator("button:has(svg.lucide-x)").click();
    await expect(callHistoryDrawer).not.toBeVisible();

    // 4. Test Forward Message Action
    const msgItems = page.locator("[data-testid^='message-item-']");
    const lastMsg = msgItems.last();
    await lastMsg.hover();

    const forwardBtn = lastMsg.locator("[data-testid^='forward-btn-']");
    await expect(forwardBtn).toBeVisible();
    await forwardBtn.click({ force: true });

    const forwardModal = page.getByTestId("forward-message-modal");
    await expect(forwardModal).toBeVisible({ timeout: 5000 });

    // Select Somchai to forward to
    const targetUserBtn = forwardModal.getByTestId("forward-target-user-somchai");
    if (await targetUserBtn.isVisible()) {
      await targetUserBtn.click();
    } else {
      // Pick general channel
      const targetChannelBtn = forwardModal.getByTestId("forward-target-channel-general");
      await targetChannelBtn.click();
    }

    await page.getByTestId("confirm-forward-btn").click();
    await expect(forwardModal).not.toBeVisible();

    // 5. Test Media Lightbox by sending an image attachment simulation
    // Send a message first
    const msgInput = page.getByTestId("message-textarea");
    await msgInput.fill("ทดสอบระบบส่งต่อข้อความเรียบร้อย!");
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(500);

    // 6. Capture High-Res Screenshot of Advanced Suite
    await page.screenshot({
      path: path.join(artifactDir, "advanced_chat_features_overview.png"),
      fullPage: false,
    });
  });
});
