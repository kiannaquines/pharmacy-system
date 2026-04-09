"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  stock: {
    label: "Stock pressure",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", sales: 24, stock: 14 },
  { month: "Feb", sales: 31, stock: 18 },
  { month: "Mar", sales: 29, stock: 17 },
  { month: "Apr", sales: 38, stock: 21 },
  { month: "May", sales: 34, stock: 19 },
  { month: "Jun", sales: 42, stock: 24 },
  { month: "Jul", sales: 40, stock: 22 },
  { month: "Aug", sales: 48, stock: 27 },
];

export function DashboardChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[320px] w-full">
      <BarChart accessibilityLayer data={chartData} barGap={10}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="sales"
          fill="var(--color-sales)"
          radius={[16, 16, 0, 0]}
        />
        <Bar
          dataKey="stock"
          fill="var(--color-stock)"
          radius={[16, 16, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
