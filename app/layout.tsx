import type { Metadata } from "next";
import { Prompt, Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const promptFont = Prompt({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin", "thai"],
  variable: "--font-prompt",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ticketapp & LiveKit Workspace - Next-Gen Realtime Platform",
  description: "Next-generation professional real-time communication suite with LiveKit calling and instant messaging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${promptFont.variable} ${plusJakarta.variable} ${inter.variable}`}
    >
      <body className="font-prompt text-slate-900 antialiased min-h-screen bg-[#F8F9FA] selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
