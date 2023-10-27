import AppProvider from "@/components/AppProvider";
import { ssrSettings } from "@/ssrSettings";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
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

      <body className={font.className}>
        <div className="fixed left-0 top-0 z-0 h-full w-full blur-sm">
          <Image
            className="object-fill object-center"
            alt="Background image"
            src={"/assets/background.webp"}
            fill
            quality={100}
          />
        </div>

        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
