import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Chat Essentials Complete Verification (Categories 1-5)", () => {
  test("Tests Profile Presence, Bookmarks, Link Previews, and Code Snippets", async ({
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

    // 3. Test Profile Settings & Presence Customization (Category 3)
    const profileBtn = page.getByTestId("open-edit-profile-btn");
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();

    const profileModal = page.getByTestId("edit-profile-modal");
    await expect(profileModal).toBeVisible();

    // Select Busy status
    const busyStatusBtn = page.getByTestId("status-option-busy");
    await expect(busyStatusBtn).toBeVisible();
    await busyStatusBtn.click();

    // Save profile
    await page.getByTestId("save-profile-btn").click();
    await expect(profileModal).not.toBeVisible();

    // 4. Select Contact Alex Dev
    const alexContact = page.getByTestId("contact-item-alex");
    await expect(alexContact).toBeVisible({ timeout: 10000 });
    await alexContact.click();
    await page.waitForTimeout(500);

    // 5. Send Code Snippet & Link Preview (Category 5)
    const textarea = page.getByTestId("message-textarea");
    const codeSnippetMsg =
      "นี่คือตัวอย่างโค้ด WebRTC Client:\n```typescript\nconst client = new LiveKitClient({\n  url: 'wss://chat.livekit.cloud',\n  token: 'SAMPLE_JWT_TOKEN'\n});\n```\nและเอกสารเพิ่มเติมที่ https://livekit.io";

    await textarea.fill(codeSnippetMsg);
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1000);

    // Verify Code Snippet Block & Link Preview Card rendered
    const codeBlock = page.getByTestId("code-snippet-block");
    await expect(codeBlock.last()).toBeVisible({ timeout: 5000 });

    const linkCard = page.getByTestId("link-preview-card");
    await expect(linkCard.last()).toBeVisible({ timeout: 5000 });

    // 6. Test Bookmarks (Category 4)
    const msgItems = page.locator("[data-testid^='message-item-']");
    const lastMsg = msgItems.last();
    await lastMsg.hover();

    const bookmarkBtn = lastMsg.locator("[data-testid^='bookmark-btn-']");
    await expect(bookmarkBtn).toBeVisible();
    await bookmarkBtn.click({ force: true });
    await page.waitForTimeout(500);

    // Open Bookmarks Drawer
    const openBookmarksBtn = page.getByTestId("open-bookmarks-btn");
    await expect(openBookmarksBtn).toBeVisible();
    await openBookmarksBtn.click();

    const bookmarksDrawer = page.getByTestId("bookmarks-drawer");
    await expect(bookmarksDrawer).toBeVisible({ timeout: 5000 });

    // 7. Capture High-Res Screenshot for Inspection
    await page.screenshot({
      path: path.join(artifactDir, "chat_essentials_complete_overview.png"),
      fullPage: false,
    });

    // Close Bookmarks Drawer
    await bookmarksDrawer.locator("button:has(svg.lucide-x)").click();
    await expect(bookmarksDrawer).not.toBeVisible();
  });
});
