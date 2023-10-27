import AnalyticsChart from "@/components/AnalyticsChart";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { ScoresaberMetricsHistory } from "@/schemas/fascinated/scoresaberMetricsHistory";
import { ssrSettings } from "@/ssrSettings";
import { formatNumber } from "@/utils/number";
import { isProduction } from "@/utils/utils";
import { Metadata } from "next";

async function getData() {
  const response = await fetch(
    "https://bs-tracker.fascinated.cc/analytics?time=30d",
    {
      next: {
        revalidate: isProduction() ? 600 : 0, // 10 minutes (0 seconds in dev)
      },
    },
  );

  const json = await response.json();
  return json as ScoresaberMetricsHistory;
}

export async function generateMetadata(): Promise<Metadata> {
  const historyData = await getData();

  const description =
    "View Scoresaber metrics and statistics over the last 30 days.";

  const lastActivePlayers =
    historyData.activePlayersHistory[
      historyData.activePlayersHistory.length - 1
    ].value;
  const lastScoreCount =
    historyData.scoreCountHistory[historyData.scoreCountHistory.length - 1]
      .value;

  return {
    title: `Analytics`,
    description: description,
    openGraph: {
      siteName: ssrSettings.siteName,
      title: `Analytics`,
      description:
        description +
        `
      Players currently online: ${formatNumber(lastActivePlayers)}
      Scores set Today: ${formatNumber(lastScoreCount)}`,
    },
  };
}

export default async function Analytics() {
  const historyData = await getData();

  return (
    <main>
      <Container>
        <Card
          className="mt-2 w-full rounded-md bg-gray-800"
          innerClassName="flex flex-col items-center justify-center"
        >
          <h1 className="text-center text-3xl font-bold">Analytics</h1>
          <p className="text-center text-gray-300">
            Scoresaber metrics and statistics over the last 30 days.
          </p>
          <div className="mt-3 h-[400px] w-full">
            <AnalyticsChart historyData={historyData} />
          </div>
        </Card>
      </Container>
    </main>
  );
}
