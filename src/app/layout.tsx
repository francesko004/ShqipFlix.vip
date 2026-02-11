import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { MobileNav } from "@/components/layout/MobileNav";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "ShqipFlix - Shiko Filma dhe Seriale Shqip Falas",
  description: "Platforma më e mirë shqiptare për të parë filma dhe seriale online falas. Përmbajtje HD, pa reklama të padëshiruara. Shiko tani!",
  keywords: ["filma shqip", "seriale shqip", "streaming shqip", "shqipflix", "filma online", "seriale online", "hd streaming"],
  authors: [{ name: "ShqipFlix" }],
  openGraph: {
    type: "website",
    locale: "sq_AL",
    url: "https://shqipflix.vip",
    siteName: "ShqipFlix",
    title: "ShqipFlix - Shiko Filma dhe Seriale Shqip Falas",
    description: "Platforma më e mirë shqiptare për të parë filma dhe seriale online falas. Përmbajtje HD, pa reklama të padëshiruara.",
    images: [
      {
        url: "/favicon.png",
        width: 1200,
        height: 630,
        alt: "ShqipFlix - Streaming Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShqipFlix - Shiko Filma dhe Seriale Shqip Falas",
    description: "Platforma më e mirë shqiptare për të parë filma dhe seriale online falas.",
    images: ["/favicon.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq">
      <body className={`${inter.variable} ${outfit.variable} font-sans pb-16 md:pb-0`}>
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}
