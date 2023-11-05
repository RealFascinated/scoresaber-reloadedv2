import { ssrSettings } from "@/ssrSettings";
import { isProduction } from "@/utils/utils";
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
  ? process.env.NEXT_PUBLIC_BUILD_ID.slice(0, 7) +
    (isProduction() ? "" : "-dev")
  : "";

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

        <div className="text-sm text-gray-400">Build ID: {buildId}</div>
      </Card>
    </footer>
  );
}
