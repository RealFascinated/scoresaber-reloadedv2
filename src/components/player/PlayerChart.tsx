import { ScoresaberPlayer } from "@/schemas/scoresaber/player";
import { formatNumber } from "@/utils/numberUtils";
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
  scoresaber: ScoresaberPlayer;
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
      grid: {
        // gray grid lines
        color: "#252525",
      },
      reverse: true,
    },
    x: {
      ticks: {
        autoSkip: true,
      },
      grid: {
        // gray grid lines
        color: "#252525",
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
          switch (context.dataset.label) {
            case "Rank": {
              return `Rank #${formatNumber(context.parsed.y.toFixed(0))}`;
            }
          }
        },
      },
    },
  },
};

export default function PlayerChart({
  className,
  scoresaber,
}: PlayerChartProps) {
  const history: number[] = scoresaber.histories
    .split(",")
    .map(function (item) {
      return parseInt(item);
    });

  let labels = [];
  for (let i = history.length; i > 0; i--) {
    let label = `${i} days ago`;
    if (i === 1) {
      label = "now";
    }
    if (i === 2) {
      label = "yesterday";
    }
    labels.push(label);
  }

  const data = {
    labels,
    datasets: [
      {
        lineTension: 0.5,
        data: history,
        label: "Rank",
        borderColor: "#3e95cd",
        fill: false,
        color: "#fff",
      },
    ],
  };

  return <Line className={className} options={options} data={data} />;
}
