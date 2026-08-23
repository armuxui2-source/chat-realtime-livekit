const fs = require("fs");
const path = require("path");

const masterRules = `# 🎯 Master Partnership, Quality & Architecture Rules (กฎเหล็กประจำตัวถาวร)

เอกสารนี้คือกฎเหล็กสูงสุดในการพัฒนาซอฟต์แวร์และร่วมงานกับ Developer ที่ต้อง **ยึดถือและบังคับใช้กับทุกโปรเจกต์ 100% (Global Mandatory Invariants)**:

---

## 1. การสื่อสารที่ตรงไปตรงมา การสอนงาน และความซื่อสัตย์ทางวิชาการ (Mentorship & Radical Honesty)
* **ห้ามเดา ห้ามดำน้ำ (Never Guess):** หากมีข้อสงสัยหรือความต้องการที่ไม่ชัดเจน ให้ถามตรงๆ หรือเสนอทางเลือกที่ถูกต้องตามหลักวิศวกรรมซอฟต์แวร์ทันที
* **ไม่ต้องอวย ไม่ต้องเยินยอ:** พูดคุยด้วยเนื้อหาวิชาการ อธิบายเหตุผลที่มาที่ไปในส่วนที่สำคัญเพื่อให้ Developer ได้เรียนรู้และเติบโตไปด้วยกัน
* **กระชับ ตรงประเด็น ทรงประสิทธิภาพ:** เน้นผลงานที่มีคุณภาพสูง โค้ดที่สะอาด และทำงานได้จริงเป็นอันดับหนึ่ง

---

## 2. กฎการรักษาแบรนด์และความเป็นมืออาชีพ (White-Label & Brand Integrity)
* **ห้ามแสดงชื่อแบรนด์อื่นหรือบุคคลที่ 3 บนหน้า UI เด็ดขาด (Strict White-Label):**
  * แม้เบื้องหลังจะใช้เทคโนโลยี เช่น LiveKit, Supabase, WebRTC, Firebase, AWS ฯลฯ แต่หน้า UI ต้องแสดงเฉพาะชื่อและฟังก์ชันของโปรเจกต์นั้นๆ เท่านั้น (เช่น "Ticketapp", "สายสนทนาสด", "คลังสื่อ", "สตอรี่")
  * ห้ามมีคำว่า "Instagram Story", "LiveKit Meeting", "Powered by XYZ" โผล่บน UI ของลูกค้า

---

## 3. มาตรฐานการจัดวางตัวอักษรและไอคอน (Typography & Iconography Standards)
* **ห้ามใช้อีโมจิ (Emoji) แทนไอคอนในปุ่มหรือเมนูระบบ (No Emojis as UI Icons):**
  * ปุ่ม แอ็กชัน เมนู และแถบนำทาง ต้องใช้ **Lucide SVG Icons เส้นบาง คมชัด เรียบหรู** เท่านั้น
* **ห้ามตัวหนังสือตกบรรทัดหรือล้นกรอบ (Zero Awkward Line Wrapping):**
  * ควบคุมการแสดงผลด้วย \`truncate\`, \`whitespace-nowrap\`, \`leading-tight\`, และ Padding สัดส่วนที่พอดี
* **ฟอนต์หลักทุกโปรเจกต์:** **\`Prompt\` (Google Font ภาษาไทย + อังกฤษ)** เสมอ

---

## 4. การแยกแยะ Workflow และการแสดงผลคอมโพเนนต์ (UI/UX Hierarchy)
* **1. Modal Dialogs (หน้าต่างป๊อปอัป):** สำหรับ Action สั้นๆ ที่ต้องการโฟกัสและจบในทันที (เช่น ยืนยันการลบ, light-box ดูรูป, ส่งต่อข้อความ)
* **2. Slide-over Drawers (พาเนลสไลด์ด้านข้าง):** สำหรับการตั้งค่าเชิงลึก, การจัดการโปรไฟล์, คลังข้อความบันทึก, ประวัติการโทร, ศูนย์แจ้งเตือน
* **3. Contextual Right Panels (คอลัมน์ขวา):** สำหรับข้อมูลประกอบที่ทำงานร่วมกับหน้าหลักแบบ Realtime (สื่อที่แชร์ร่วมกันในห้อง, รายชื่อสมาชิกกลุ่ม)
* **4. Floating Capsule Navbars (แถบลอยตัว):** สำหรับการควบคุมหลักที่ต้องการการเข้าถึงรวดเร็ว (Bottom Nav บนมือถือ, Audio/Video Call HUD)

---

## 5. สัดส่วนและโทนสีมาตรฐาน (Figma Frosted Glass & Dark Gunmetal)
* **PC / Desktop (≥1024px):** 3-Column Tri-Pane เต็มจอ ไร้ขอบดำ
* **Mobile (<768px):** Single-Column Stack พร้อม Floating Capsule Bar
* **ชุดสี:** Dark Gunmetal (\`#0F1216\`, \`#161A22\`), Frosted Glass (\`backdrop-blur-xl bg-white/[0.06]\`), และ Emerald Gradient Accent (\`#4ADE80\` ➔ \`#22C55E\` ➔ \`#16A34A\`)
`;

// Save to Global Config
const globalRulesDir = "C:\\\\Users\\\\armyn\\\\.gemini\\\\config\\\\rules";
fs.mkdirSync(globalRulesDir, { recursive: true });
fs.writeFileSync(path.join(globalRulesDir, "working-principles.md"), masterRules, "utf8");

const globalSkillDir = "C:\\\\Users\\\\armyn\\\\.gemini\\\\config\\\\skills\\\\premium-ui-ux-design-standards";
fs.mkdirSync(globalSkillDir, { recursive: true });
fs.writeFileSync(path.join(globalSkillDir, "SKILL.md"), masterRules, "utf8");

const globalConfigDir = "C:\\\\Users\\\\armyn\\\\.gemini\\\\config";
fs.writeFileSync(path.join(globalConfigDir, "GEMINI.md"), masterRules, "utf8");

// Save to Workspace Local Config
const localRulesDir = path.join(__dirname, "..", ".agents", "rules");
fs.mkdirSync(localRulesDir, { recursive: true });
fs.writeFileSync(path.join(localRulesDir, "working-principles.md"), masterRules, "utf8");

const localAgentsMd = path.join(__dirname, "..", "AGENTS.md");
fs.writeFileSync(localAgentsMd, masterRules, "utf8");

console.log("MASTER_RULES_UPDATED_ACROSS_ALL_SYSTEMS");
