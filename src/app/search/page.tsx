import Avatar from "@/components/Avatar";
import Container from "@/components/Container";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default function Home() {
  return (
    <main>
      <Container>
        <div className="mt-2 bg-neutral-800 w-full flex flex-col items-center justify-center rounded-sm">
          <Avatar
            className="m-6"
            label="Player Avatar"
            url="https://cdn.fascinated.cc/yb4fgdc1.jpg"
          />

          <p className="text-xl">Stranger</p>
          <p className="text mt-2">Find a player profile</p>

          <form className="mt-6 flex gap-2">
            <input
              className="bg-transparent text-xs outline-none min-w-[14rem] border-b"
              type="text"
              placeholder="Enter a name or ScoreSaber profile..."
            />
            <button className="bg-blue-600 hover:opacity-80 transition-all transform-gpu rounded-md p-1">
              <MagnifyingGlassIcon
                className="font-black"
                width={18}
                height={18}
              />
            </button>
          </form>

          <div className="mb-6"></div>
        </div>
      </Container>
    </main>
  );
}
