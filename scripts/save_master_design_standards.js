const fs = require("fs");
const path = require("path");

const masterSkillContent = `---
name: premium-ui-ux-design-standards
description: Master production-grade UI/UX design standards for modern web & mobile applications. Implements Figma & Pinterest board standards (RonDesignLab, Iko Setiawan, Bento SaaS, WhatsApp Dark Gunmetal), 3-Tier Responsive Engine (PC Desktop 3-Column / Mobile 1-Column Floating Capsule), Thai Prompt Typography Scale, Frosted Glassmorphism, and Human-Centered UX Architecture. Use for ALL projects and UI development.
---

# 💎 Master UI/UX Production Standards & Design System Specification

คู่มือแม่แบบและกฎเหล็กการออกแบบ User Interface / User Experience (UI/UX) ระดับ World-Class Production ตามมาตรฐานของ **Pinterest Board (RonDesignLab, Iko Setiawan, Bento SaaS, Finova)** ที่ต้อง **นำมาใช้เป็นค่าหลักอัตโนมัติกับทุกโปรเจกต์ 100%** โดยไม่ต้องรอสั่งซ้ำ

---

## ⚡ กฎเหล็กที่ 1: การวิเคราะห์และวางแผนก่อนลงมือทำ (Planning & Analysis First)
1. **วิเคราะห์พฤติกรรมมนุษย์ (Human Psychology):** ทุกปุ่ม ทุกการ์ด และทุกเมนูต้องอยู่ในจุดที่ผู้ใช้คาดหวังตามธรรมชาติ (เช่น ปุ่มโทรอยู่ในห้องแชท/โปรไฟล์ ไม่วางรกส่วนหัว)
2. **สร้าง Implementation Plan เสมอ:** วางโครงสร้าง Layout, สัดส่วนขนาดการ์ด, และชุดสีให้ชัดเจนก่อนเริ่มเขียนโค้ด
3. **ห้ามทำ UI แบบเด็กเล่น / ลวกๆ:** ห้ามใช้สีไอคอนสีรุ้งสะเปะสะปะ (No Rainbow badges) ให้ใช้ Monochrome Glassmorphism หรือ Dark Neutral เท่านั้น

---

## 🇹🇭 กฎเหล็กที่ 2: ระบบฟอนต์มาตรฐานประจำตัว (Typography System)
* **ฟอนต์หลักประจำตัว (Mandatory Font):** **\`Prompt\` (Google Font ภาษาไทย + อังกฤษ)**
* **CSS Declaration:**
  \`\`\`css
  font-family: var(--font-prompt), "Prompt", sans-serif;
  letter-spacing: -0.015em;
  \`\`\`
* **Typography Hierarchy:**
  * **H1 / Hero Display:** \`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]\`
  * **H2 / Section Title:** \`text-lg sm:text-xl font-extrabold text-white\`
  * **H3 / Card Header:** \`text-sm sm:text-base font-bold text-white tracking-tight\`
  * **Body / Message Content:** \`text-xs sm:text-[13px] leading-relaxed text-slate-200\`
  * **Subtext / Meta / Timestamps:** \`text-[10px] sm:text-[11px] font-medium text-slate-400 font-mono\`

---

## 📐 กฎเหล็กที่ 3: สัดส่วนและขนาดเลย์เอาต์ (Layout & Proportions Engine)

### 3.1 สัดส่วนหน้าจอคอมพิวเตอร์ (PC / Desktop Viewport ≥ 1024px / 1440px)
* **3-Tier Tri-Pane Layout (ใช้พื้นที่เต็มหน้าจอ ไร้ขอบดำว่างเปล่า):**
  1. **Left Slim Navigation Rail (64px - 72px):** แถบไอคอนหลักแนวตั้ง (Monochrome Squircle Icons)
  2. **Conversation / Sub-Menu Sidebar (280px - 320px):** รายชื่อห้องสนทนา, Story Tray แนวนอน, ช่องค้นหา, และ Segmented Tab
  3. **Main Workspace / Center Feed (Fluid \`flex-1 min-w-0\`):** พื้นที่แชทหรือแดชบอร์ดหลัก ยืดหยุ่นตามความกว้างจอ
  4. **Right Contextual Drawer (320px - 380px):** สไลด์พาเนลสำหรับรายละเอียดโปรไฟล์, สื่อที่แชร์, หรือการตั้งค่า (เปิด/ปิดได้นุ่มนวล)

### 3.2 สัดส่วนหน้าจอมือถือ (Mobile Viewport < 768px)
* **Single-Column Fluid Viewport (\`100dvh\`, \`w-full\`):**
* **Floating Capsule Bottom Navigation Bar (ความสูง 56px - 64px):**
  * ลอยเหนือขอบล่าง \`bottom-3 mx-4\` ด้วย Frosted Glass (\`rounded-full\`)
  * มี Active Capsule Indicator ครอบไอคอนที่เลือกอย่างสมูท

### 3.3 ขนาดการ์ดและช่องไฟมาตรฐาน (Bento Grid & Card Proportions)
* **Card Corner Radius:** \`rounded-2xl\` (16px) หรือ \`rounded-3xl\` (24px)
* **Card Inner Padding:** \`p-4\` (16px) สำหรับการ์ดเล็ก, \`p-5\` ถึง \`p-6\` (20px - 24px) สำหรับการ์ดหลัก
* **Grid Gaps:** \`gap-3\` (12px) ถึง \`gap-4\` (16px)
* **Progress Rings & Charts:**
  * วงแหวนความคืบหน้า (Circular Progress Rings) เช่น \`72%\` โค้งมนพร้อม Gradient
  * กราฟเส้น Curve นุ่มนวล (Smooth Bezier) พร้อมพื้นที่ใต้กราฟไล่ระดับสีโปร่งแสง (Area Gradient)

---

## 🎨 กฎเหล็กที่ 4: ชุดธีมสีและวัสดุแก้ว (Figma Frosted Glass Spec)

### 4.1 Master Dark Gunmetal Theme (WhatsApp & Finova Dark Spec)
* **App Outer Background:** \`#0B0D10\`
* **Main Feed & Canvas:** \`#0F1216\` (Matte Dark Gunmetal)
* **Sidebars & Panels:** \`#161A22\` (Charcoal Container)
* **Cards & Receiver Bubbles:** \`#1E232B\` with \`border-white/[0.07]\`
* **Sender Bubbles & Highlights:** \`#16A34A\` / \`#22C55E\` (Emerald Green)

### 4.2 Frosted Glass Tokens
\`\`\`css
/* Frosted Glass Container */
.glass-frosted {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 36px 0 rgba(0, 0, 0, 0.4);
}

/* Emerald Glass Accent Card */
.glass-emerald-card {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(22, 163, 74, 0.05) 100%),
              rgba(22, 26, 34, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(74, 222, 128, 0.25);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* Emerald Glow Button */
.emerald-button-gradient {
  background: linear-gradient(135deg, #4ADE80 0%, #22C55E 50%, #16A34A 100%);
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
\`\`\`

---

## 📱 กฎเหล็กที่ 5: คอมโพเนนต์มาตรฐานระดับโปรดักชั่น (Production Component Blueprints)

1. **Profile Action Bar (3 Pills):**
   * ซ้ายสุด: \`[🔍 ค้นหาเพื่อน]\` (Search & Add Friend Modal)
   * ตรงกลาง: \`[🔗 คัดลอกลิงก์]\` (Copy Link + Toast)
   * ขวาสุด: \`[📱 คิวอาร์โค้ด]\` (Personal Frosted QR Card with Download & Share)
   * ด้านล่าง: \`[✏️ แก้ไขข้อมูลโปรไฟล์]\`
2. **Social Activity & Notification Bell:**
   * กระดิ่งแจ้งเตือนที่มุมขวาบนของโปรไฟล์
   * แสดงคำขอเป็นเพื่อนใหม่ (\`[ยอมรับ]\` / \`[ปฏิเสธ]\`) และยอดผู้เข้าชมสตอรี่
3. **Dynamic Action Sheets & Selection Bottom Drawers:**
   * การ์ดสไลด์โค้งมน \`rounded-3xl\` พร้อม Search Bar, Avatar ย่อ, รายการ Radio, และปุ่ม Action ตรึงล่างสุด
4. **Clean Logout Safety:**
   * ปุ่ม Log Out ต้องซ่อนอย่างปลอดภัยไว้ท้ายสุดของการตั้งค่าความเป็นส่วนตัว ไม่วางเด่นบนหน้าโปรไฟล์หลัก
`;

// Save to Global Customizations Root
const globalSkillDir = "C:\\\\Users\\\\armyn\\\\.gemini\\\\config\\\\skills\\\\premium-ui-ux-design-standards";
fs.mkdirSync(globalSkillDir, { recursive: true });
fs.writeFileSync(path.join(globalSkillDir, "SKILL.md"), masterSkillContent, "utf8");

const globalRuleDir = "C:\\\\Users\\\\armyn\\\\.gemini\\\\config\\\\rules";
fs.mkdirSync(globalRuleDir, { recursive: true });
fs.writeFileSync(path.join(globalRuleDir, "ui-design-standards.md"), masterSkillContent, "utf8");

// Save to Workspace Customizations Root
const localSkillDir = path.join(__dirname, "..", ".agents", "skills", "premium-ui-ux-design-standards");
fs.mkdirSync(localSkillDir, { recursive: true });
fs.writeFileSync(path.join(localSkillDir, "SKILL.md"), masterSkillContent, "utf8");

const localRuleDir = path.join(__dirname, "..", ".agents", "rules");
fs.mkdirSync(localRuleDir, { recursive: true });
fs.writeFileSync(path.join(localRuleDir, "ui-design-standards.md"), masterSkillContent, "utf8");

console.log("MASTER_DESIGN_STANDARDS_PERMANENTLY_SAVED");
