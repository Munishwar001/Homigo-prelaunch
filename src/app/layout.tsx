import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Homigo — Book Home Services Just By Speaking",
  description:
    "Homigo is an AI-powered voice-based home services marketplace for Indian households. No searching. No calling around. No waiting. Just speak.",
  openGraph: {
    title: "Homigo — Book Home Services Just By Speaking",
    description:
      "AI-powered voice home services marketplace for Indian households. Plumbing, electrical, cleaning and more — just say the word.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAFAF7] text-[#1C1C1E]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
