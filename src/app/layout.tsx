import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { MobileNav } from "@/components/layout/MobileNav";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.globalSettings.findFirst();
  const siteName = settings?.siteName || "ShqipFlix";
  const siteDescription = settings?.siteDescription || "Platforma lider shqiptare për transmetimin e filmave, serialeve dhe kanaleve Live TV.";

  return {
    title: {
      template: `%s - ${siteName}`,
      default: `${siteName} - Shiko Filma dhe Seriale Shqip Falas`,
    },
    description: siteDescription,
    keywords: ["filma shqip", "seriale shqip", "streaming shqip", "shqipflix", "filma online", "seriale online", "hd streaming"],
    authors: [{ name: siteName }],
    openGraph: {
      type: "website",
      locale: "sq_AL",
      url: "https://shqipflix.vip",
      siteName: siteName,
      title: `${siteName} - Shiko Filma dhe Seriale Shqip Falas`,
      description: siteDescription,
      images: [
        {
          url: "/favicon.png",
          width: 1200,
          height: 630,
          alt: `${siteName} - Streaming Platform`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} - Shiko Filma dhe Seriale Shqip Falas`,
      description: siteDescription,
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
}

import { PWAInstallPrompt } from "@/components/ui/PWAInstallPrompt";

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
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
