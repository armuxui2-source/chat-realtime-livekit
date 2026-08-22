import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Phase 2: Group Chat & Channel Management Verification", () => {
  test("Tests Channels Tab, General Channel, Create Channel Modal, and Group Messaging", async ({
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

    // 3. Switch to Channels Tab
    const channelsTab = page.getByTestId("tab-channels");
    await expect(channelsTab).toBeVisible();
    await channelsTab.click();
    await page.waitForTimeout(500);

    // 4. Select General Channel
    const generalChannel = page.getByTestId("channel-item-general");
    await expect(generalChannel).toBeVisible({ timeout: 10000 });
    await generalChannel.click();
    await page.waitForTimeout(500);

    // 5. Verify Chat Header shows General Channel
    const headerTitle = page.getByTestId("chat-header-display-name");
    await expect(headerTitle).toContainText(/General/i);

    // 6. Verify Right Details Panel shows Channel info & Member list
    const rightPanel = page.getByTestId("right-details-panel");
    await expect(rightPanel).toBeVisible();
    await expect(rightPanel.getByText(/สมาชิก/i).first()).toBeVisible();

    // 7. Send a message in General Channel
    const textarea = page.getByTestId("message-textarea");
    await textarea.fill("ยินดีต้อนรับทุกคนเข้าสู่ห้อง General ของทีมครับ");
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1000);

    // 8. Test Create New Channel via Modal
    const openCreateChannelBtn = page.getByTestId("open-create-channel-btn");
    await expect(openCreateChannelBtn).toBeVisible();
    await openCreateChannelBtn.click();

    // Fill Create Channel Modal
    const modal = page.getByTestId("create-channel-modal");
    await expect(modal).toBeVisible();

    await page.getByTestId("channel-name-input").fill("product-launch");
    await page.getByTestId("channel-desc-input").fill("แผนการเปิดตัวระบบ Realtime Chat");

    // Select Alex Dev as initial member
    const alexMemberSelect = page.getByTestId("select-member-alex");
    if (await alexMemberSelect.isVisible()) {
      await alexMemberSelect.click();
    }

    // Submit Create Channel
    await page.getByTestId("submit-create-channel-btn").click();
    await page.waitForTimeout(1000);

    // 9. Verify New Channel is active and send message
    await expect(headerTitle).toContainText("product-launch");
    await textarea.fill("ห้องสำหรับวางแผนเปิดตัว Product Launch พร้อมใช้งานแล้วครับ");
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1000);

    // 10. Capture High-Res Screenshot for Inspection
    await page.screenshot({
      path: path.join(artifactDir, "group_chat_overview.png"),
      fullPage: false,
    });
  });
});
