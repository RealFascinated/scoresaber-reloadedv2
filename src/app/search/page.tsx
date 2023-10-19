import Avatar from "@/components/Avatar";
import Container from "@/components/Container";

import SearchPlayer from "@/components/SearchPlayer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default function Home() {
  return (
    <main>
      <Container>
        <div className="mt-2 flex w-full flex-col items-center justify-center rounded-sm bg-neutral-800">
          <Avatar
            className="m-6"
            label="Player Avatar"
            url="https://cdn.fascinated.cc/yb4fgdc1.jpg"
          />

          <p className="text-xl">Stranger</p>
          <p className="text mt-2">Find a player profile</p>

          <SearchPlayer />

          <div className="mb-6"></div>
        </div>
      </Container>
    </main>
  );
}
