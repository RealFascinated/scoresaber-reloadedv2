"use client";

import { ScoresaberPlayerCountHistory } from "@/schemas/fascinated/scoresaberPlayerCountHistory";
import { formatTimeAgo } from "@/utils/timeUtils";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

type PlayerChartProps = {
  className?: string;
  playerCountHistoryData: ScoresaberPlayerCountHistory;
};

export const options: any = {
  maintainAspectRatio: false,
  aspectRatio: 1,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    y: {
      ticks: {
        autoSkip: true,
        maxTicksLimit: 8,
        stepSize: 1,
      },
    },
    x: {
      ticks: {
        autoSkip: true,
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  plugins: {
    legend: {
      position: "top" as const,
      labels: {
        color: "white",
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label(context: any) {
          switch (
            context.dataset.label
            // case "Rank": {
            //   return `Rank #${formatNumber(context.parsed.y.toFixed(0))}`;
            // }
          ) {
          }
        },
      },
    },
  },
};

export default function AnalyticsChart({
  className,
  playerCountHistoryData,
}: PlayerChartProps) {
  const playerCountHistory = playerCountHistoryData.history;

  let labels = [];
  for (let i = 0; i < playerCountHistory.length; i++) {
    if (i == playerCountHistory.length - 1) {
      labels.push("now");
      continue;
    }
    labels.push(formatTimeAgo(playerCountHistory[i].time));
  }

  const data = {
    labels,
    datasets: [
      {
        lineTension: 0.5,
        data: playerCountHistory.map((count) => count.value || "0"),
        label: "Active Players",
        borderColor: "#3e95cd",
        fill: false,
        color: "#fff",
      },
    ],
  };

  return <Line className={className} options={options} data={data} />;
}
