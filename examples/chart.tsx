"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Area, AreaChart } from "recharts";

import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const barData = [
  { month: "Jan", components: 12, installs: 84 },
  { month: "Feb", components: 18, installs: 130 },
  { month: "Mar", components: 24, installs: 198 },
  { month: "Apr", components: 31, installs: 240 },
  { month: "May", components: 38, installs: 312 },
  { month: "Jun", components: 45, installs: 390 },
];

const barConfig = {
  components: { label: "Components", color: "var(--color-primary)" },
  installs: { label: "Installs", color: "var(--color-muted-foreground)" },
} satisfies ChartConfig;

const areaData = [
  { month: "Jan", users: 420 },
  { month: "Feb", users: 680 },
  { month: "Mar", users: 910 },
  { month: "Apr", users: 1240 },
  { month: "May", users: 1580 },
  { month: "Jun", users: 2100 },
];

const areaConfig = {
  users: { label: "Active users", color: "var(--color-primary)" },
} satisfies ChartConfig;

export function ChartDemo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Bar chart */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Monthly activity</p>
        <ChartContainer config={barConfig} className="h-52">
          <BarChart data={barData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="components" fill="var(--color-components)" radius={4} />
            <Bar dataKey="installs" fill="var(--color-installs)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      {/* Area chart */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">User growth</p>
        <ChartContainer config={areaConfig} className="h-52">
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="users"
              stroke="var(--color-users)"
              fill="url(#fillUsers)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
