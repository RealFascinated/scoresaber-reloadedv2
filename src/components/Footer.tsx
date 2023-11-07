import ssrSettings from "@/ssrSettings.json";
import { isProduction } from "@/utils/utils";
import Link from "next/link";
import Card from "./Card";

const buttons = [
  {
    name: "Privacy",
    url: "/privacy",
  },
  {
    name: "Credits",
    url: "/credits",
  },
];

const buildId = process.env.NEXT_PUBLIC_BUILD_ID
  ? isProduction()
    ? process.env.NEXT_PUBLIC_BUILD_ID.slice(0, 7)
    : "dev"
  : "";
const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
const gitUrl = isProduction()
  ? `https://git.fascinated.cc/Fascinated/scoresaber-reloaded-v2/commit/${buildId}`
  : "https://git.fascinated.cc/Fascinated/scoresaber-reloaded-v2";

export default function Footer() {
  return (
    <footer className="p-3">
      <Card className="mb-2 mt-2 flex flex-col items-center justify-center gap-1 !pb-1 !pt-0">
        <div className="flex flex-col items-center gap-1 md:flex-row md:items-start md:gap-3">
          <a
            className="transform-gpu transition-all hover:text-blue-500"
            href="https://git.fascinated.cc/Fascinated/scoresaber-reloaded-v2"
          >
            {ssrSettings.siteName}
          </a>

          <div className="flex divide-x divide-solid divide-neutral-500">
            {buttons.map((button, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row items-center justify-center gap-3 pl-2 pr-2"
                >
                  <a
                    href={button.url}
                    className="transform-gpu transition-all hover:text-blue-500"
                  >
                    {button.name}
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        <Link
          className="transform-gpu text-sm text-gray-400 transition-all hover:opacity-80"
          href={gitUrl}
          target="_blank"
        >
          Build ID: {buildId} ({buildTime})
        </Link>
      </Card>
    </footer>
  );
}
