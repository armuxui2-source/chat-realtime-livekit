---
name: premium-ui-ux-design-standards
description: Master production-grade UI/UX design standards for modern web & mobile applications. Implements Figma-spec Frosted Glassmorphism, Floating Capsule Navbars, Dynamic Action Sheets, Bottom Selection Drawers, and Human-Centered UX Architecture. Use for all UI/UX design and frontend component development.
---

# 💎 Premium UI/UX Design Standards & Architecture Specification

คู่มือมาตรฐานและแนวทางการออกแบบ User Interface / User Experience (UI/UX) ระดับ World-Class Production ที่ต้องนำมาใช้เป็น **มาตรฐานหลักสำหรับทุกโปรเจกต์**

---

## 1. Core Visual DNA & Aesthetic Hierarchy

### 1.1 Color Palette & Atmospheric Depth
* **Deep Matte Backgrounds (Never Pitch Black):**
  * Shell / App Background: `#0F1216` (Gunmetal Matte) or `#0B0D10`
  * Panels & Sidebars: `#161A22` (Dark Charcoal) with `border-white/[0.07]`
  * Cards & Nested Containers: `#1E232B` / `rgba(255, 255, 255, 0.04)`
* **Signature Accent Glow & Prismatic Highlights:**
  * Emerald / Mint Gradient: `linear-gradient(135deg, #4ADE80 0%, #22C55E 50%, #16A34A 100%)`
  * Soft Ambient Edge Glow: Prismatic subtle gradient along top-left card borders (`rgba(74, 222, 128, 0.25)`)
  * Glow Box Shadow: `box-shadow: 0 4px 20px rgba(34, 197, 94, 0.35)`

### 1.2 Figma Frosted Glassmorphism Spec
* **Glass Container Formula:**
  ```css
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  border-radius: 1.25rem; /* rounded-2xl / rounded-3xl */
  ```

---

## 2. Component Design Blueprints (จากภาพอ้างอิงแม่แบบ)

### 2.1 Floating Capsule Navigation & Tab Bar (ภาพที่ 1)
* **โครงสร้าง:** แถบแคปซูลลอยทรงมนสมบูรณ์แบบ (`rounded-full`) ด้วย Frosted Glass
* **Active State:** Capsule Pill ครอบไอคอนที่เลือกอย่างนุ่มนวล พร้อมแสง Glow เบาๆ
* **Iconography:** ใช้ไอคอน Monochrome เส้นบาง คมชัด เรียบหรู (`Lucide Icons`, `strokeWidth={1.8}`)

### 2.2 Dark Frosted Auth & Login Card (ภาพที่ 2)
* **Title Hierarchy:** หัวข้อตัวหนาชัดเจน (`H1 text-2xl font-bold`) + Subtext สีเทาอ่อน
* **Integrated Input Pill:** กล่อง Input ที่มีปุ่ม Action ฝังอยู่ด้านในสุดทางขวา (เช่น ปุ่มลูกศรสีเขียวทรงกลม `rounded-full`)
* **OAuth SSO Buttons:** กล่องสี่เหลี่ยมผืนผ้ามน `rounded-2xl bg-white/[0.04]` พร้อมไอคอนแบรนด์แท้ (Google, X/Twitter) และลูกศรชี้นำทาง

### 2.3 Dynamic Floating Status Sheets (ภาพที่ 3)
* **Loading State:** แสดงไอคอนเคลื่อนไหว / ภาพวาด + ข้อความบอกขั้นตอนแบบเป็นมิตร ("Performing magic...") + ปุ่มแคปซูลดำพร้อม Spinner
* **Success State:** วงกลมเขียวเครื่องหมายถูก + ข้อความแสดงความยินดี ("We are live! 🎉") + ปุ่ม `[Close]` รอง และปุ่ม `[View live ↗]` หลัก
* **Error State:** วงกลมเหลืองสามเหลี่ยมเตือนภัย + อธิบายสาเหตุและวิธีแก้ไข + ปุ่ม `[Close]` และ `[Try again]`

### 2.4 Bottom Sheet Selection Drawers (ภาพที่ 4)
* **Slide-over / Bottom Sheet:** เลื่อนขึ้นจากด้านล่างหรือด้านข้าง พร้อม Handle Bar และปุ่ม `X` ปิดมุมขวา
* **Search Integration:** กล่องค้นหาติดไว้ด้านบนสุดเสมอ สำหรับกรองรายชื่อหรือหมวดหมู่
* **Grouped Rows:** จัดแถวพร้อม Avatar ย่อ, ชื่อ, รายละเอียด, และ Radio/Checkmark ขวามือ
* **Persistent Bottom Action:** ปุ่ม Action สำคัญตรึงอยู่ด้านล่างเสมอ (เช่น `[+ New Item]`, `[Continue]`)

### 2.5 Profile Hierarchy & Information Grouping (ภาพที่ 5)
* **Centric Avatar:** รูปโปรไฟล์ทรงกลมขนาดใหญ่ตรงกลาง พร้อมปุ่มดินสอแก้ไขลอยอยู่มุมขวาล่าง (`ring-2 ring-emerald-500/30`)
* **Unified Grouped Cards:** รวมข้อมูลที่เกี่ยวข้องกัน (เบอร์โทร, อีเมล, ที่อยู่) ไว้ภายในการ์ดโค้งมนใบเดียว มีไอคอนนำและลูกศร Chevron ด้านขวา
* **Horizontal Squircle Grid Cards:** หมวดหมู่ย่อย (เช่น เอกสาร, สถิติ, ประวัติ) จัดเป็นกล่องมน Squircle วางเรียงกันในแนวนอน

---

## 3. Human-Centered UX Rules (กฎเหล็กในการพัฒนา)

1. **ห้ามใช้สีไอคอนสีรุ้งฉูดฉาดแบบเด็กเล่น:** ไอคอนทั้งหมดต้องใช้ Monochrome Glassmorphism หรือ Neutral Palette
2. **ห้ามวางปุ่ม Action ผิดที่ผิดทาง:** ปุ่มโทรวิดีโอต้องอยู่ในห้องแชทหรือหน้าโปรไฟล์ ไม่วางรกส่วนหัว Sidebar
3. **ปุ่มออกจากระบบ (Log Out):** ต้องซ่อนไว้อย่างปลอดภัยที่ด้านล่างสุดของการตั้งค่าความเป็นส่วนตัว
4. **ความสมบูรณ์แบบของช่องไฟ (Spacing & Padding):** ใช้ระยะห่างที่หายใจได้ (`p-4`, `p-5`, `gap-3`) และมุมโค้งมนที่สอดคล้องกันทั่วทั้งระบบ (`rounded-2xl`, `rounded-3xl`)
