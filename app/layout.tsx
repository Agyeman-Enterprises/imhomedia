import type { Metadata, Viewport } from "next";
import { Raleway, Rubik } from "next/font/google";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });
const rubik = Rubik({ subsets: ["latin"], variable: "--font-rubik" });

export const metadata: Metadata = {
  title: "IMHO Media | S'Truth. Just Saying!",
  description:
    "The world's first all-AI music radio station. Mixed Heritage Beats — where Afrobeats meets Jazz meets Gospel meets whatever the AI feels like.",
  openGraph: {
    title: "IMHO Media — Mixed Heritage Beats",
    description: "The world's first all-AI music station. 24/7 fusion vibes.",
    url: "https://imho.media",
    siteName: "IMHO Media",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1048, height: 630 }],
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
    <html lang="en" className={`${raleway.variable} ${rubik.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
