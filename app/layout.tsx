import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IMHO Media | Unfiltered. Unbothered. Unapologetically Us.",
  description:
    "The world's first all-AI music radio station. Mixed Heritage Beats — where Afrobeats meets Jazz meets Gospel meets whatever the AI feels like.",
  openGraph: {
    title: "IMHO Media — Mixed Heritage Beats",
    description: "The world's first all-AI music station. 24/7 fusion vibes.",
    url: "https://imho.media",
    siteName: "IMHO Media",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
