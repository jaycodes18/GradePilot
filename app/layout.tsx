import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientRoot } from "@/components/ClientRoot";

const display = Space_Grotesk({
  subsets: ["latin"],
  display: "block",
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "GradePilot — GPA-Optimized Study Planner",
  description:
    "AI-powered study optimization for students. Add classes, exam weights, and available time to generate a prioritized study plan and curated calendar.",
  applicationName: "GradePilot",
  authors: [{ name: "GradePilot" }],
  keywords: ["study planner", "GPA optimizer", "student productivity", "exam prep", "education app"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFDF5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="bg-neo-bg text-neo-black font-display antialiased min-h-screen">
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
