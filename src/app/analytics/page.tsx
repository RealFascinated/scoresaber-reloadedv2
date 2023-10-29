import AnalyticsChart from "@/components/AnalyticsChart";
import Card from "@/components/Card";
import Container from "@/components/Container";
import { ScoresaberMetricsHistory } from "@/schemas/fascinated/scoresaberMetricsHistory";
import { ssrSettings } from "@/ssrSettings";
import { formatNumber } from "@/utils/numberUtils";
import { isProduction } from "@/utils/utils";
import { Metadata } from "next";
import Link from "next/link";

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
  return {
    data: json as ScoresaberMetricsHistory,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await getData();

  const description =
    "View Scoresaber metrics and statistics over the last 30 days.";

  const lastActivePlayers =
    data.activePlayersHistory[data.activePlayersHistory.length - 1].value;
  const lastScoreCount =
    data.scoreCountHistory[data.scoreCountHistory.length - 1].value;

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
  const { data, timezone } = await getData();

  return (
    <main>
      <Container>
        <Card
          className="mt-2 w-full rounded-md bg-gray-800"
          innerClassName="flex flex-col items-center justify-center"
        >
          <h1 className="text-center text-3xl font-bold">Analytics</h1>
          <p className="text-center">
            Scoresaber metrics and statistics over the last 30 days.
          </p>
          <p className="text-gray-300">
            Want more in-depth data? Click{" "}
            <span className="text-pp-blue">
              <Link
                href="https://grafana.fascinated.cc/d/c40febe5-6779-4f91-b85e-0a46b3865041/beatsaber-metrics"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </Link>
            </span>
          </p>
          <p className="text-gray-300">Timezone: {timezone}</p>
          <div className="mt-3 h-[400px] w-full">
            <AnalyticsChart historyData={data} />
          </div>
        </Card>
      </Container>
    </main>
  );
}
