import Card from "@/components/Card";
import Container from "@/components/Container";
import UnknownAvatar from "@/components/UnknownAvatar";

import SearchPlayer from "@/components/player/SearchPlayer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default function Home() {
  return (
    <main>
      <Container>
        <Card
          className="mt-2 w-full rounded-md bg-gray-800"
          innerClassName="flex flex-col items-center justify-center"
        >
          <UnknownAvatar />

          <p className="text-xl">Stranger</p>
          <p className="text mt-2">Find a player profile</p>

          <SearchPlayer />

          <div className="mb-6"></div>
        </Card>
      </Container>
    </main>
  );
}
