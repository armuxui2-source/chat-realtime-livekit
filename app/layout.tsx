import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Social Solution - Real-time Chat & WebRTC Suite",
  description: "Web application สำหรับแชทข้อความ โทรเสียง และวิดีโอคอล 1:1 แบบ Real-time สไตล์ Modern Soft-Light Glassmorphic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${prompt.variable}`}>
      <body className="font-prompt text-slate-800 antialiased min-h-screen selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
