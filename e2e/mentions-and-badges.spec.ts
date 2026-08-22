import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Category 2: @Mentions and Badges Verification", () => {
  test("Tests @Mention popover trigger, member selection, and highlighted mention pill in message feed", async ({
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

    // 4. Click Quick Mention button (@)
    const mentionBtn = page.getByTestId("quick-mention-btn");
    await expect(mentionBtn).toBeVisible();
    await mentionBtn.click();

    // 5. Verify Mention Popover is visible
    const popover = page.getByTestId("mention-popover");
    await expect(popover).toBeVisible({ timeout: 5000 });

    // 6. Select Alex from mention list
    const mentionItem = page.getByTestId("mention-item-alex");
    await expect(mentionItem).toBeVisible();
    await mentionItem.click();

    // 7. Append message text
    const textarea = page.getByTestId("message-textarea");
    await textarea.pressSequentially("รบกวนตรวจสอบรายงานระบบประจำวันด้วยครับ");
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1000);

    // 8. Verify Mention Pill is rendered inside the new message
    const mentionHighlights = page.getByTestId("mention-highlight");
    await expect(mentionHighlights.last()).toBeVisible({ timeout: 5000 });

    // 9. Capture High-Res Screenshot for Inspection
    await page.screenshot({
      path: path.join(artifactDir, "mentions_and_badges_overview.png"),
      fullPage: false,
    });
  });
});
