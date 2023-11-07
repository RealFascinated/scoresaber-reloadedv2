import AppProvider from "@/components/AppProvider";
import ssrSettings from "@/ssrSettings.json";
import clsx from "clsx";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const font = Inter({ subsets: ["latin-ext"], weight: "500" });

// TODO: use type when NextJS fixes the type:
// export const viewport: Viewport = {
export const viewport: any = {
  themeColor: "#3B82F6",
};

export const metadata: Metadata = {
  metadataBase: new URL(ssrSettings.siteUrl),
  title: {
    template: ssrSettings.siteName + " - %s",
    default: ssrSettings.siteName,
  },
  description: ssrSettings.description,
  keywords:
    "scoresaber, score saber, scoresaber stats, score saber stats, beatleader, beat leader, " +
    "scoresaber reloaded, ssr, github, score aggregation, scoresaber api, score saber api, scoresaber api",
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
        defer
        data-domain="ssr.fascinated.cc"
        src="https://analytics.fascinated.cc/js/script.js"
      />

      <body className={clsx(font.className, "text-primary")}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
