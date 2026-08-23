# 📋 ตารางตรวจสอบฟังก์ชันและสถานะหน้าจอทั้งหมด (Master Feature Inventory)

เอกสารนี้คือ **"กระดานตรวจสอบสถานะฟังก์ชันจริง (Living Feature Matrix)"** ที่รวบรวมทุกหน้าจอ ทุกโมดอล และทุกฟังก์ชันในระบบ **Ticketapp Realtime Web Application** เพื่อให้ทั้งคุณและผมตรวจสอบสถานะได้ตรงกัน 100% โดยไม่ต้องสับสน:

---

## 🧭 1. ตารางตรวจสอบสถานะ 7 โซนหลักของแอปพลิเคชัน

| หมวดหมู่ (Zone) | หน้าจอ / คอมโพเนนต์ (Screen & Component) | วิธีการเข้าถึง (Trigger & Workflow) | สถานะความพร้อม (Status) |
| :--- | :--- | :--- | :---: |
| **Zone 1: Onboarding & Auth** | 1.1 Bento Landing Page | หน้าแรกเมื่อยังไม่ล็อกอิน | ✅ ทำงานได้ 100% |
| | 1.2 Dark Frosted Auth Modal | กดปุ่ม \`เข้าสู่ระบบ\` หรือ \`ทดลองใช้งาน Demo\` | ✅ ทำงานได้ 100% |
| **Zone 2: Navigation Rail** | 2.1 Left Slim Rail (64px) | แถบซ้ายสุดบน Desktop | ✅ ทำงานได้ 100% |
| | 2.2 Floating Bottom Nav Bar | ลอยเหนือขอบล่างบน Mobile (<768px) | ✅ ทำงานได้ 100% |
| **Zone 3: Sidebar & Lists** | 3.1 Contact & Channel List | แท็บ \`ส่วนตัว\` vs \`กลุ่ม\` | ✅ ทำงานได้ 100% |
| | 3.2 Top Story Tray | แถบสตอรี่ด้านบนของ Sidebar | ✅ ทำงานได้ 100% |
| | 3.3 Create Channel Modal | กดปุ่ม \`+\` ในแถบแชนแนลกลุ่ม | ✅ ทำงานได้ 100% |
| **Zone 4: Chat Workspace** | 4.1 Chat Header & Call Buttons | ปุ่มโทรเสียง / วิดีโอคอลด้านบนห้องแชท | ✅ ทำงานได้ 100% |
| | 4.2 Emerald / Charcoal Message Bubbles | ฟีดข้อความ แชทส่วนตัวและแชทกลุ่ม | ✅ ทำงานได้ 100% |
| | 4.3 Plus Attachment Menu (\`+\`) | กดปุ่ม \`+\` ในช่องพิมพ์แชท | ✅ ทำงานได้ 100% |
| | 4.4 Voice Note Recorder | กดปุ่มไอคอนไมค์ในช่องพิมพ์ | ✅ ทำงานได้ 100% |
| | 4.5 Link Preview & Code Snippets | ส่ง URL หรือบล็อกโค้ดในแชท | ✅ ทำงานได้ 100% |
| **Zone 5: Context & Drawers** | 5.1 Shared Media / Files / Members | คอลัมน์ขวาบน Desktop เมื่อเปิดห้องแชท | ✅ ทำงานได้ 100% |
| | 5.2 Instagram Profile Hub | กดเมนู \`โปรไฟล์\` ในแถบซ้าย | ✅ ทำงานได้ 100% |
| | 5.3 3-Action Tool Pills | กดปุ่ม \`ค้นหาเพื่อน\`, \`คัดลอกลิงก์\`, \`คิวอาร์โค้ด\` | ✅ ทำงานได้ 100% |
| | 5.4 Personal QR Code Card View | กดปุ่ม \`คิวอาร์โค้ด\` ในหน้าโปรไฟล์ | ✅ ทำงานได้ 100% |
| | 5.5 Activity & Notification Center | กดไอคอนกระดิ่งที่มุมโปรไฟล์ | ✅ ทำงานได้ 100% |
| | 5.6 Bookmarks Slide-in Drawer | กดไอคอน Bookmark ในแถบซ้าย | ✅ ทำงานได้ 100% |
| | 5.7 Call Logs Slide-in Drawer | กดไอคอนโทรศัพท์ในแถบซ้าย | ✅ ทำงานได้ 100% |
| **Zone 6: Realtime Calls** | 6.1 Incoming Call Banner | มีสายโทรเข้าแบบเรียลไทม์ | ✅ ทำงานได้ 100% |
| | 6.2 HD Video/Audio Call HUD | หน้าต่างโทรพร้อมแถบควบคุมและ PiP | ✅ ทำงานได้ 100% |
| **Zone 7: Media Modals** | 7.1 Story Viewer Modal | กดที่รูปโปรไฟล์ในแถบสตอรี่ | ✅ ทำงานได้ 100% |
| | 7.2 Media Lightbox Modal | กดที่รูปภาพในฟีดแชท | ✅ ทำงานได้ 100% |
| | 7.3 Forward Message Modal | กดปุ่มส่งต่อที่ข้อความแชท | ✅ ทำงานได้ 100% |
| | 7.4 Add Friend Modal | กดปุ่มเพิ่มเพื่อนในแถบนำทาง | ✅ ทำงานได้ 100% |

---

## 🔍 2. กระบวนการตรวจสอบแบบอัตโนมัติ (Automated Verification Protocol)

เพื่อแก้ปัญหาเรื่อง "ไม่แน่ใจว่าหน้าไหนสร้างแล้วหรือยังไม่ได้สร้าง" เรามีสคริปต์ **\`scripts/audit_all_screens.js\`** ที่รันการทดสอบและจับภาพหน้าจอของ **ทุกหน้าจอ ทุกโมดอล และทุกปุ่มกด** ออกมาเป็นหลักฐานจริงยืนยันความถูกต้องเสมอ
