"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
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

const CHART_DATA = [
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

const ROWS = [
  {
    coach: "Helmut Krug",
    discipline: "Giant Slalom",
    goal: 24,
    id: "1",
    name: "Marco Odermatt",
    sessions: 20,
    status: "in-process",
  },
  {
    coach: "Mike Day",
    discipline: "Slalom",
    goal: 28,
    id: "2",
    name: "Mikaela Shiffrin",
    sessions: 26,
    status: "done",
  },
  {
    coach: "M. Blardone",
    discipline: "Downhill",
    goal: 18,
    id: "3",
    name: "Sofia Goggia",
    sessions: 12,
    status: "cancelled",
  },
  {
    coach: "—",
    discipline: "All-round",
    goal: 22,
    id: "4",
    name: "Alexis Pinturault",
    sessions: 18,
    status: "pending",
  },
  {
    coach: "M. Blardone",
    discipline: "Super-G",
    goal: 20,
    id: "5",
    name: "Lara Gut-Behrami",
    sessions: 17,
    status: "done",
  },
  {
    coach: "Helmut Krug",
    discipline: "Slalom",
    goal: 26,
    id: "6",
    name: "Henrik Kristoffersen",
    sessions: 22,
    status: "in-process",
  },
  {
    coach: "—",
    discipline: "Slalom",
    goal: 24,
    id: "7",
    name: "Petra Vlhová",
    sessions: 20,
    status: "pending",
  },
  {
    coach: "M. Blardone",
    discipline: "Downhill",
    goal: 16,
    id: "8",
    name: "Corinne Suter",
    sessions: 14,
    status: "done",
  },
  {
    coach: "C. Pravda",
    discipline: "Super-G",
    goal: 14,
    id: "9",
    name: "Matthias Mayer",
    sessions: 10,
    status: "cancelled",
  },
  {
    coach: "—",
    discipline: "All-round",
    goal: 22,
    id: "10",
    name: "Wendy Holdener",
    sessions: 20,
    status: "done",
  },
];

const STATUS_STYLES: Record<string, string> = {
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "in-process": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const RANGES = ["Last 3 months", "Last 30 days", "Last 7 days"];

// ─── Components ───────────────────────────────────────────────────────────────

const StatCards = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {STATS.map((stat) => (
      <div
        key={stat.label}
        className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col gap-6 py-6"
      >
        <div className="px-6 pb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium ${stat.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}
            >
              {stat.trendUp ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {stat.trend}
            </span>
          </div>
          <div className="text-2xl font-bold leading-none">{stat.value}</div>
        </div>
        <div className="px-6 pt-0">
          <p className="flex items-center gap-1 text-sm font-medium">
            {stat.subtitle}
            {stat.trendUp ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{stat.description}</p>
        </div>
      </div>
    ))}
  </div>
);

const ChartSection = () => {
  const [active, setActive] = React.useState(RANGES[0]);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col gap-6 py-6">
      <div className="px-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-semibold leading-none">Training Sessions</div>
            <div className="text-sm text-muted-foreground mt-1">
              Total sessions completed across the season
            </div>
          </div>
          <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mt-2 sm:mt-0">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setActive(r)}
                className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-all ${active === r ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={CHART_DATA} margin={{ left: 0, right: 0 }}>
            <defs>
              <linearGradient id="fillVisitors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(240 5.9% 10%)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(240 5.9% 10%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="hsl(240 5.9% 90%)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(240 5.9% 90%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Area
              dataKey="visitors"
              type="monotone"
              fill="url(#fillVisitors)"
              stroke="hsl(240 5.9% 10%)"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DataTableSection = () => {
  const [filter, setFilter] = React.useState("");
  const [page, setPage] = React.useState(0);
  const PER_PAGE = 5;

  const filtered = ROWS.filter(
    (r) =>
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      r.discipline.toLowerCase().includes(filter.toLowerCase()),
  );
  const paged = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col gap-6 py-6">
      <div className="px-6">
        <div className="font-semibold leading-none">Athlete Overview</div>
        <div className="text-sm text-muted-foreground mt-1">
          Track athlete progress, session targets, and coach assignments.
        </div>
      </div>
      <div className="px-6">
        <input
          type="text"
          placeholder="Filter athletes..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
          className="h-9 w-full max-w-xs rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="px-6 overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b">
              {["Athlete", "Discipline", "Status", "Goal", "Sessions", "Coach"].map((h) => (
                <th
                  key={h}
                  className="h-10 px-2 text-left align-middle font-medium text-muted-foreground whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-2 align-middle font-medium">{row.name}</td>
                <td className="p-2 align-middle text-muted-foreground">{row.discipline}</td>
                <td className="p-2 align-middle">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[row.status]}`}
                  >
                    {row.status.replace("-", " ")}
                  </span>
                </td>
                <td className="p-2 align-middle tabular-nums">{row.goal}</td>
                <td className="p-2 align-middle tabular-nums">{row.sessions}</td>
                <td className="p-2 align-middle text-muted-foreground">{row.coach}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length} athlete{filtered.length === 1 ? "" : "s"}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="rounded-md border px-3 py-1 text-xs disabled:opacity-50 hover:bg-muted"
          >
            Previous
          </button>
          <span>
            Page {page + 1} of {Math.max(1, totalPages)}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-md border px-3 py-1 text-xs disabled:opacity-50 hover:bg-muted"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const Page = () => (
  <div className="min-h-svh bg-background p-6 flex flex-col gap-6">
    <StatCards />
    <ChartSection />
    <DataTableSection />
  </div>
);

export default Page;
