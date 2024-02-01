import AppProvider from "@/components/AppProvider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ssrSettings from "@/ssrSettings.json";
import clsx from "clsx";
import { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const font = Inter({ subsets: ["latin-ext"], weight: "500" });

export const viewport: Viewport = {
  themeColor: "#3B82F6",
};

export const metadata: Metadata = {
  metadataBase: new URL(ssrSettings.siteUrl),
  title: {
    template: ssrSettings.siteNameShort + " - %s",
    default: ssrSettings.siteName,
  },
  description: ssrSettings.description,
  keywords:
    "scoresaber, score saber, scoresaber stats, score saber stats, beatleader, beat leader," +
    "scoresaber reloaded, ssr, github, score aggregation, scoresaber api, score saber api, scoresaber api," +
    "BeatSaber, Overlay, OBS, Twitch, YouTube, BeatSaber Overlay, Github, Beat Saber overlay, ScoreSaber, BeatLeader," +
    "VR gaming, Twitch stream enhancement, Customizable overlay, Real-time scores, Rankings, Leaderboard information," +
    "Stream enhancement, Professional overlay, Easy to use overlay builder.",
  openGraph: {
    title: ssrSettings.siteName,
    description: ssrSettings.description,
    url: ssrSettings.siteUrl,
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Script
        id="plausible"
        data-domain="ssr.fascinated.cc"
        src="https://analytics.fascinated.cc/js/script.js"
        defer
      />

      <body className={clsx(font.className, "text-primary")}>
        <ThemeProvider
          storageKey="ssr-theme"
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <AppProvider>{children}</AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
