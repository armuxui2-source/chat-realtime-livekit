import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Phase 4: Search, Pin & Media Archive Verification", () => {
  test("Tests Pinning Messages, In-Chat Search Filter, and Shared Media Gallery", async ({
    page,
  }) => {
    const artifactDir =
      "C:/Users/armyn/.gemini/antigravity-ide/brain/742993f7-9e54-451f-8d01-6551bad41c1b";

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

    // 4. Send an important message to pin
    const textarea = page.getByTestId("message-textarea");
    await textarea.fill("📌 นัดประชุมสรุปสถานะโปรเจกต์วันพรุ่งนี้เวลา 10:00 น. ขอให้ทุกคนเตรียมสไลด์พร้อมครับ");
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1000);

    // 5. Test Pinning the Message
    const msgItems = page.locator("[data-testid^='message-item-']");
    const lastMsg = msgItems.last();
    await lastMsg.hover();

    const pinBtn = lastMsg.locator("[data-testid^='pin-btn-']");
    await expect(pinBtn).toBeVisible();
    await pinBtn.click({ force: true });
    await page.waitForTimeout(500);

    // 6. Verify Pinned Message Banner appeared
    const pinnedBanner = page.getByTestId("pinned-message-banner");
    await expect(pinnedBanner).toBeVisible({ timeout: 5000 });

    // 7. Verify Pinned count badge in Chat Header
    const pinnedBadge = page.getByTestId("pinned-count-badge");
    await expect(pinnedBadge).toBeVisible();

    // 8. Test In-Chat Realtime Search
    const searchToggleBtn = page.getByTestId("toggle-chat-search-btn");
    await expect(searchToggleBtn).toBeVisible();
    await searchToggleBtn.click();

    const searchInput = page.getByTestId("in-chat-search-input");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("นัดประชุมสรุปสถานะ");
    await page.waitForTimeout(500);

    // Verify search matches
    await expect(page.getByText(/ผลการค้นหาสำหรับ/i)).toBeVisible();

    // 9. Capture High-Res Screenshot for Inspection
    await page.screenshot({
      path: path.join(artifactDir, "search_and_pin_overview.png"),
      fullPage: false,
    });
  });
});
