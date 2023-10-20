import { isProduction } from "@/utils/utils";

const buttons = [
  {
    name: "Privacy",
    url: "/privacy",
  },
];

const buildId = process.env.NEXT_PUBLIC_BUILD_ID
  ? process.env.NEXT_PUBLIC_BUILD_ID.slice(0, 7) +
    (isProduction() ? "" : "-dev")
  : "";

export default function Footer() {
  return (
    <footer className="m-3 rounded-md bg-gray-800 text-gray-300">
      <div className="m-3 flex flex-col items-center justify-center gap-1">
        <div className="flex flex-row gap-3">
          <p>Scoresaber Reloaded</p>

          {buttons.map((button, index) => {
            return (
              <div
                key={index}
                className="flex flex-row items-center justify-center gap-3"
              >
                <div className="h-4 w-[1px] bg-neutral-100"></div>
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

        <div className="text-sm text-gray-400">Build ID: {buildId}</div>
      </div>
    </footer>
  );
}
