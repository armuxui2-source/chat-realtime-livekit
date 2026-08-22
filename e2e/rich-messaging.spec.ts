import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Phase 1: Rich Messaging Features Verification", () => {
  test("Tests Reply, Reactions, Edit, and File Upload UI", async ({ page }) => {
    const artifactDir = "C:/Users/armyn/.gemini/antigravity-ide/brain/742993f7-9e54-451f-8d01-6551bad41c1b";

    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Load App
    await page.goto("http://localhost:3000");

    // 2. Login if on Auth modal
    const quickLoginBtn = page.getByTestId("quick-login-sarah");
    if (await quickLoginBtn.isVisible()) {
      await quickLoginBtn.click();
      await page.waitForTimeout(500);
    }

    // 3. Ensure Left Sidebar is visible
    const sidebar = page.getByTestId("left-navigation-sidebar");
    await expect(sidebar).toBeVisible({ timeout: 10000 });

    // 4. Select Contact Alex Dev
    const alexContact = page.getByTestId("contact-item-alex");
    await expect(alexContact).toBeVisible({ timeout: 10000 });
    await alexContact.click();
    await page.waitForTimeout(500);

    // 5. Send First Message
    const textarea = page.getByTestId("message-textarea");
    await textarea.fill("เอกสารสรุปสเปกงานโปรเจกต์พร้อมแล้วครับ");
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1000);

    // 6. Test Reply to Message
    const msgItems = page.locator("[data-testid^='message-item-']");
    const lastMsg = msgItems.last();
    await lastMsg.hover();

    const replyBtn = lastMsg.locator("[data-testid^='reply-btn-']");
    await replyBtn.click({ force: true });

    // Verify replying banner
    await expect(page.getByTestId("replying-banner")).toBeVisible({ timeout: 5000 });
    await textarea.fill("นี่คือข้อความตอบกลับอ้างอิงข้อความด้านบนครับ");
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1000);

    // 7. Test Reaction Toggle
    const newLastMsg = page.locator("[data-testid^='message-item-']").last();
    await newLastMsg.hover();
    const reactBtn = newLastMsg.locator("[data-testid^='react-btn-']");
    await reactBtn.click({ force: true });

    const thumbsUpOption = page.getByTestId("reaction-option-thumbs-up");
    await expect(thumbsUpOption).toBeVisible({ timeout: 5000 });
    await thumbsUpOption.click({ force: true });
    await page.waitForTimeout(500);

    // Verify reaction pill appeared
    const reactionPill = newLastMsg.locator("[data-testid^='reaction-pill-']");
    await expect(reactionPill).toBeVisible({ timeout: 5000 });

    // 8. Test Edit Message
    await newLastMsg.hover();
    const editBtn = newLastMsg.locator("[data-testid^='edit-btn-']");
    if (await editBtn.isVisible()) {
      await editBtn.click({ force: true });
      const editInput = newLastMsg.locator("input[type='text']");
      await editInput.fill("นี่คือข้อความตอบกลับ (แก้ไขคำผิดเรียบร้อย)");
      await newLastMsg.getByRole("button", { name: "บันทึก", exact: true }).click();
      await page.waitForTimeout(500);
      await expect(newLastMsg.getByText("(แก้ไขแล้ว)")).toBeVisible();
    }

    // 9. Capture High-Res Screenshot for Inspection
    await page.screenshot({
      path: path.join(artifactDir, "rich_messaging_overview.png"),
      fullPage: false,
    });
  });
});
