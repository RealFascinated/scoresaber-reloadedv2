"use client";

import { ScoresaberMetricsHistory } from "@/schemas/fascinated/scoresaberMetricsHistory";
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
  historyData: ScoresaberMetricsHistory;
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
  },
};

export default function AnalyticsChart({
  className,
  historyData,
}: PlayerChartProps) {
  const playerCountHistory = historyData.activePlayersHistory;
  const scoreCountHistory = historyData.scoreCountHistory;

  let labels = [];
  for (let i = 0; i < playerCountHistory.length; i++) {
    if (i == playerCountHistory.length - 1) {
      labels.push("today");
      continue;
    }
    if (i == playerCountHistory.length - 2) {
      labels.push("yesterday");
      continue;
    }
    if (i >= 1) {
      const date = playerCountHistory[i - 1].time;
      labels.push(formatTimeAgo(date));
    } else {
      labels.push("30 days ago");
    }
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
      {
        lineTension: 0.5,
        data: scoreCountHistory.map((count) => count.value || "0"),
        label: "Scores Set",
        borderColor: "#8e5ea2",
        fill: false,
        color: "#fff",
      },
    ],
  };

  return <Line className={className} options={options} data={data} />;
}
