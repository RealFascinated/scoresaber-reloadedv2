import Card from "@/components/Card";
import Container from "@/components/Container";
import UnknownAvatar from "@/components/UnknownAvatar";

import SearchPlayer from "@/components/SearchPlayer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export default function Home() {
  return (
    <main>
      <Container>
        <Card
          outerClassName="mt-2"
          className="flex flex-col items-center justify-center"
        >
          <UnknownAvatar />

          <h1 className="text-xl">Search Player</h1>
          <p className="text mt-2 text-gray-300">Find yourself or a friend</p>

          <SearchPlayer />
        </Card>
      </Container>
    </main>
  );
}
