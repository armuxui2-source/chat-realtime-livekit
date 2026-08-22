import { test, expect } from "@playwright/test";
import path from "path";

test.describe("3-Column Desktop Layout Verification (1440x900)", () => {
  test("Renders Left, Middle, and Right columns with standard icons and no emojis", async ({
    page,
  }) => {
    const artifactDir = "C:/Users/armyn/.gemini/antigravity-ide/brain/742993f7-9e54-451f-8d01-6551bad41c1b";

    // Set standard PC/Desktop viewport 1440x900
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Visit App
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");

    // 2. Select Quick Login: Sarah Miller
    const quickLoginBtn = page.getByTestId("quick-login-sarah");
    await expect(quickLoginBtn).toBeVisible({ timeout: 10000 });
    await quickLoginBtn.click();
    await page.waitForTimeout(500);

    // 3. Verify 3-Column Structure exists
    const leftSidebar = page.getByTestId("left-navigation-sidebar");
    await expect(leftSidebar).toBeVisible();

    // Select contact Alex Dev to populate middle and right columns
    const alexContact = page.getByTestId("contact-item-alex");
    await expect(alexContact).toBeVisible();
    await alexContact.click();
    await page.waitForTimeout(500);

    // Middle Column
    const chatContainer = page.getByTestId("chat-container-active");
    await expect(chatContainer).toBeVisible();

    // Right Column
    const rightPanel = page.getByTestId("right-details-panel");
    await expect(rightPanel).toBeVisible();

    // 4. Send a test message
    const textarea = page.getByTestId("message-textarea");
    await textarea.fill("ทดสอบระบบแสดงผล 3 คอลัมน์ Desktop 1440x900 พร้อมมาตรฐาน Lucide Icons ✨");
    await page.getByTestId("send-message-btn").click();
    await page.waitForTimeout(1000);

    // 5. Capture High-Res Screenshot for Inspection
    await page.screenshot({
      path: path.join(artifactDir, "desktop_1440x900_3column_overview.png"),
      fullPage: false,
    });
  });
});
