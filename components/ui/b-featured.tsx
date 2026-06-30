"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from '@/components/ui/e-data-table';
import type { DataTableRow } from '@/components/ui/e-data-table';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FeaturedStat {
  label: string;
  trend: string;
  trendUp: boolean;
  value: string;
  subtitle: string;
  description: string;
}

export interface FeaturedChartPoint {
  date: string;
  visitors: number;
}

export interface FeaturedBlockProps {
  stats?: FeaturedStat[];
  chartTitle?: string;
  chartDescription?: string;
  chartData?: FeaturedChartPoint[];
  chartRanges?: string[];
  tableTitle?: string;
  tableDescription?: string;
  tableRows?: DataTableRow[];
  rowsPerPageOptions?: number[];
  className?: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_STATS: FeaturedStat[] = [
  {
    description: "Across all disciplines",
    label: "Registered Athletes",
    subtitle: "Trending up this season",
    trend: "+12.5%",
    trendUp: true,
    value: "1,284",
  },
  {
    description: "Review entry requirements",
    label: "Race Entries",
    subtitle: "Down 8% this period",
    trend: "-8%",
    trendUp: false,
    value: "3,842",
  },
  {
    description: "Targets exceeded this month",
    label: "Sessions Completed",
    subtitle: "Strong training retention",
    trend: "+18.3%",
    trendUp: true,
    value: "24,610",
  },
  {
    description: "Meets season projections",
    label: "Podium Rate",
    subtitle: "Steady performance increase",
    trend: "+4.5%",
    trendUp: true,
    value: "38.2%",
  },
];

const DEFAULT_CHART_DATA: FeaturedChartPoint[] = [
  { date: "Nov 4", visitors: 1200 },
  { date: "Nov 11", visitors: 2800 },
  { date: "Nov 18", visitors: 4100 },
  { date: "Nov 25", visitors: 5600 },
  { date: "Dec 2", visitors: 7400 },
  { date: "Dec 9", visitors: 9800 },
  { date: "Dec 16", visitors: 12_300 },
  { date: "Dec 23", visitors: 15_700 },
  { date: "Jan 6", visitors: 18_200 },
  { date: "Jan 13", visitors: 14_900 },
  { date: "Jan 20", visitors: 17_300 },
  { date: "Jan 27", visitors: 20_100 },
  { date: "Feb 3", visitors: 22_800 },
  { date: "Feb 10", visitors: 24_610 },
];

const DEFAULT_TABLE_ROWS: DataTableRow[] = [
  {
    avatarSrc: "https://i.pravatar.cc/40?img=3",
    header: "Marco Odermatt",
    id: "1",
    limit: 20,
    reviewer: "Helmut Krug",
    sectionType: "Giant Slalom",
    status: "in-process",
    target: 24,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=5",
    header: "Mikaela Shiffrin",
    id: "2",
    limit: 26,
    reviewer: "Mike Day",
    sectionType: "Slalom",
    status: "done",
    target: 28,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=10",
    header: "Sofia Goggia",
    id: "3",
    limit: 12,
    reviewer: "M. Blardone",
    sectionType: "Downhill",
    status: "cancelled",
    target: 18,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=12",
    header: "Alexis Pinturault",
    id: "4",
    limit: 18,
    reviewer: null,
    sectionType: "All-round",
    status: "pending",
    target: 22,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=9",
    header: "Lara Gut-Behrami",
    id: "5",
    limit: 17,
    reviewer: "M. Blardone",
    sectionType: "Super-G",
    status: "done",
    target: 20,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=15",
    header: "Henrik Kristoffersen",
    id: "6",
    limit: 22,
    reviewer: "Helmut Krug",
    sectionType: "Slalom",
    status: "in-process",
    target: 26,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=11",
    header: "Petra Vlhová",
    id: "7",
    limit: 20,
    reviewer: null,
    sectionType: "Slalom",
    status: "pending",
    target: 24,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=8",
    header: "Corinne Suter",
    id: "8",
    limit: 14,
    reviewer: "M. Blardone",
    sectionType: "Downhill",
    status: "done",
    target: 16,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=20",
    header: "Matthias Mayer",
    id: "9",
    limit: 10,
    reviewer: "Christian Pravda",
    sectionType: "Super-G",
    status: "cancelled",
    target: 14,
  },
  {
    avatarSrc: "https://i.pravatar.cc/40?img=13",
    header: "Wendy Holdener",
    id: "10",
    limit: 20,
    reviewer: null,
    sectionType: "All-round",
    status: "done",
    target: 22,
  },
];

// ─── Stat Cards ──────────────────────────────────────────────────────────────

function StatCards({ stats }: { stats: FeaturedStat[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium",
                  stat.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
                )}
              >
                {stat.trendUp ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {stat.trend}
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="flex items-center gap-1 text-sm font-medium">
              {stat.subtitle}
              {stat.trendUp ? (
                <TrendingUp className="size-3.5" />
              ) : (
                <TrendingDown className="size-3.5" />
              )}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Chart ───────────────────────────────────────────────────────────────────

const chartConfig = {
  visitors: {
    color: "var(--foreground)",
    label: "Visitors",
  },
} satisfies ChartConfig;

function ChartSection({
  title,
  description,
  data,
  ranges,
}: {
  title: string;
  description: string;
  data: FeaturedChartPoint[];
  ranges: string[];
}) {
  const [activeRange, setActiveRange] = React.useState(ranges[0]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Tabs value={activeRange} onValueChange={setActiveRange}>
            <TabsList>
              {ranges.map((r) => (
                <TabsTrigger key={r} value={r}>
                  {r}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-55 w-full">
          <AreaChart data={data} margin={{ left: 0, right: 0 }}>
            <defs>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="visitors"
              type="monotone"
              fill="url(#fillVisitors)"
              stroke="var(--foreground)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── FeaturedBlock ────────────────────────────────────────────────────────────

function FeaturedBlock({
  stats = DEFAULT_STATS,
  chartTitle = "Training Sessions",
  chartDescription = "Total sessions completed across the season",
  chartData = DEFAULT_CHART_DATA,
  chartRanges = ["Last 3 months", "Last 30 days", "Last 7 days"],
  tableTitle = "Athlete Overview",
  tableDescription = "Track athlete progress, session targets, and coach assignments.",
  tableRows = DEFAULT_TABLE_ROWS,
  rowsPerPageOptions = [10, 20, 50],
  className,
}: FeaturedBlockProps) {
  return (
    <div data-slot="featured-block" className={cn("flex flex-col gap-6 p-6", className)}>
      <StatCards stats={stats} />
      <ChartSection
        title={chartTitle}
        description={chartDescription}
        data={chartData}
        ranges={chartRanges}
      />
      <DataTable
        rows={tableRows}
        title={tableTitle}
        description={tableDescription}
        rowsPerPageOptions={rowsPerPageOptions}
        columnLabels={{
          assignPlaceholder: "Assign coach",
          filterPlaceholder: "Filter athletes...",
          header: "Athlete",
          limit: "Sessions",
          reviewer: "Coach",
          sectionType: "Discipline",
          target: "Goal",
        }}
      />
    </div>
  );
}

export { FeaturedBlock };
export default FeaturedBlock;
