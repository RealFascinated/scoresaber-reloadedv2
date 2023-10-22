import { AppProvider } from "@/components/AppProvider";
import { ssrSettings } from "@/ssrSettings";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const font = Inter({ subsets: ["latin-ext"], weight: "500" });

export const metadata: Metadata = {
  title: {
    template: ssrSettings.siteName + " - %s",
    default: ssrSettings.siteName,
  },
  openGraph: {
    title: ssrSettings.siteName,
    description: "Aggregate your scores with other leaderboards together!",
    url: ssrSettings.siteUrl,
    locale: "en_US",
    type: "website",
  },
  themeColor: "#3B82F6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
