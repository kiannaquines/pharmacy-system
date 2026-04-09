"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

type Props = {
  labels: string[];
  values: number[];
};

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: (ctx) =>
          ` ₱${Number(ctx.parsed.y).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: "#94a3b8" },
      border: { display: false },
    },
    y: {
      grid: { color: "rgba(0,0,0,0.06)" },
      ticks: {
        font: { size: 11 },
        color: "#94a3b8",
        callback: (v) => `₱${Number(v).toLocaleString()}`,
      },
      border: { display: false },
    },
  },
  elements: {
    point: { radius: 3, hoverRadius: 5 },
    line: { tension: 0.4 },
  },
};

export function SalesChart({ labels, values }: Props) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        fill: true,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsla(var(--primary), 0.12)",
        borderWidth: 2,
        pointBackgroundColor: "hsl(var(--primary))",
      },
    ],
  };

  return (
    <div className="h-[200px] w-full">
      <Line data={data} options={options} />
    </div>
  );
}
