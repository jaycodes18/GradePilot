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
  title: "Lexicon — Know What You Sign",
  description:
    "AI-powered contract analysis for startups and small businesses. Upload any legal agreement and get risk flags, missing clause alerts, and negotiation suggestions in plain English.",
  applicationName: "Lexicon",
  authors: [{ name: "Lexicon" }],
  keywords: ["contract analysis", "legal AI", "startup", "NDA", "MSA", "legal tech"],
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
