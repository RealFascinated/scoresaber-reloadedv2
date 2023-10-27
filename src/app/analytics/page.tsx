import AnalyticsChart from "@/components/AnalyticsChart";
import Card from "@/components/Card";
import Container from "@/components/Container";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
};

export async function getData() {
  const response = await fetch(
    "https://bs-tracker.fascinated.cc/analytics?time=30d",
    {
      next: {
        revalidate: 600, // 10 minutes
      },
    },
  );

  const json = await response.json();
  return json;
}

export default async function Home() {
  const playerCountHistory = await getData();

  return (
    <main>
      <Container>
        <Card
          className="mt-2 w-full rounded-md bg-gray-800"
          innerClassName="flex flex-col items-center justify-center"
        >
          <h1 className="text-center text-3xl font-bold">Analytics</h1>
          <p className="text-center text-gray-300">
            Scoresaber metrics and statistics over time.
          </p>
          <div className="mt-3 h-[400px] w-full">
            <AnalyticsChart playerCountHistoryData={playerCountHistory} />
          </div>
        </Card>
      </Container>
    </main>
  );
}
