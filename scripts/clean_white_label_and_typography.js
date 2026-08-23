const fs = require("fs");
const path = require("path");

function replaceInFile(filePath, replacements) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, "utf8");
  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to);
  }
  fs.writeFileSync(fullPath, content, "utf8");
  console.log("Updated:", filePath);
}

// 1. Landing Hero
replaceInFile("components/landing/LandingHero.tsx", [
  ['href="#livekit"', 'href="#media-calls"'],
  ["Realtime WebRTC LiveKit Cloud + Supabase Engine 2.0", "Ticketapp Realtime Ultra-Fast Engine"],
  ["Card 2: LiveKit Voice & Video", "Card 2: HD Voice & Video Calls"],
  ["<span>LiveKit Cloud SFU</span>", "<span>HD Voice & Video SFU</span>"],
  ["“ระบบ Ticketapp ออกแบบมาได้มืออาชีพ สวยงาม และใช้งานง่ายมาก ระบบ LiveKit", "“ระบบ Ticketapp ออกแบบมาได้มืออาชีพ สวยงาม และใช้งานง่ายมาก ระบบสื่อสารสายสด"],
  ["© 2026 Ticketapp. Built with Next.js 14, LiveKit Cloud & Supabase Engine.", "© 2026 Ticketapp Platform. All rights reserved."],
  ["สตอรี่ & คอนเนกชันแบบ Instagram", "สตอรี่ & กิจกรรมอัปเดตเรียลไทม์"],
]);

// 2. Edit Profile Modal
replaceInFile("components/profile/EditProfileModal.tsx", [
  ["ความปลอดภัย & LiveKit", "ความปลอดภัย & ระบบเครือข่าย"],
  ["Security & LiveKit", "Security & Network Infrastructure"],
  ["LiveKit Cloud WebRTC SFU", "ระบบเครือข่ายสื่อสารความเร็วสูง (High-Speed Realtime Media)"],
]);

// 3. Right Details Panel
replaceInFile("components/layout/RightDetailsPanel.tsx", [
  ["Supercar Dark Mode และ LiveKit PiP Mode เรียบร้อย", "Supercar Dark Mode และหน้าต่างลอย PiP Mode เรียบร้อย"],
]);

// 4. Chat Header & Chat Container
replaceInFile("components/chat/ChatHeader.tsx", [
  ['title="วิดีโอคอล LiveKit"', 'title="วิดีโอคอล (Video Call)"'],
]);

replaceInFile("components/chat/ChatContainer.tsx", [
  ["และประชุม LiveKit ได้ทันที", "และโทรเสียง/วิดีโอคอลได้ทันที"],
  ["LiveKit Meeting", "ห้องประชุมสายสด (Meeting Room)"],
]);

// 5. LiveKitMeetRoom & CallModal
replaceInFile("components/call/LiveKitMeetRoom.tsx", [
  ["<span>LiveKit</span>", "<span>HD Call</span>"],
  ["กำลังโทรออก LiveKit Audio...", "กำลังโทรออกสายเสียงสด..."],
  ["กำลังเชื่อมต่อสัญญาณ WebRTC SFU Cloud...", "กำลังเชื่อมต่อสัญญาณเรียลไทม์ความเร็วสูง..."],
]);

replaceInFile("components/call/CallModal.tsx", [
  ["กำลังเชื่อมต่อสัญญาณ WebRTC ผ่าน LiveKit...", "กำลังเชื่อมต่อสัญญาณเสียงและวิดีโอระดับ HD..."],
  ["กำลังเชื่อมต่อสัญญาณ WebRTC ผ่าน LiveKit Cloud...", "กำลังเชื่อมต่อสัญญาณเสียงและวิดีโอระดับ HD..."],
]);

// 6. Story Viewer Modal
replaceInFile("components/story/StoryViewerModal.tsx", [
  ["<span>Instagram Story</span>", "<span>สตอรี่ (Story)</span>"],
]);

console.log("WHITE_LABEL_CLEANUP_COMPLETED");
