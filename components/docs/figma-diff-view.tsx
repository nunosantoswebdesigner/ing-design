"use client";

import { CheckIcon, AlertTriangleIcon, XIcon, MinusIcon } from "lucide-react";
import { useState } from "react";

import type {
  DiffResult,
  DiffStatus,
  DiffToken,
  TokenCategory,
} from "@/lib/figma-diff";
import { cn } from "@/lib/utils";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABEL: Record<DiffStatus, string> = {
  drift: "Drift",
  extra: "Extra",
  missing: "Missing",
  sync: "Sync",
};

const STATUS_ICON: Record<DiffStatus, React.ReactNode> = {
  drift: <AlertTriangleIcon className="size-3" />,
  extra: <MinusIcon className="size-3" />,
  missing: <XIcon className="size-3" />,
  sync: <CheckIcon className="size-3" />,
};

const CATEGORY_LABEL: Record<TokenCategory, string> = {
  colors: "Colors",
  other: "Other",
  radius: "Radius",
  spacing: "Spacing",
  typography: "Typography",
};

// ─── Color swatch ─────────────────────────────────────────────────────────────

const Swatch = ({ hex, className }: { hex?: string; className?: string }) => {
  if (!hex) {
    return null;
  }
  return (
    <span
      className={cn(
        "inline-block size-3.5 shrink-0 rounded-[3px] border border-white/10 shadow-sm",
        className
      )}
      style={{ background: hex }}
    />
  );
};

// ─── Token row ────────────────────────────────────────────────────────────────

const TokenRow = ({ token }: { token: DiffToken }) => {
  const { cssVar, figma, code, status } = token;

  return (
    <div
      className={cn(
        "grid items-center gap-0 border-b border-border/50 last:border-0",
        "grid-cols-[1fr_auto_1fr_auto]",
        "px-4 py-2.5 min-h-[44px]",
        "border-l-2 transition-colors",
        status === "sync" && "border-l-transparent hover:bg-muted/30",
        status === "drift" &&
          "border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/10",
        status === "missing" &&
          "border-l-destructive bg-destructive/5 hover:bg-destructive/10",
        status === "extra" && "border-l-muted-foreground/30 hover:bg-muted/30"
      )}
    >
      {/* Token name + figma value */}
      <div className="flex items-center gap-2 min-w-0 pr-2">
        <code className="text-[11px] text-foreground shrink-0 font-mono truncate max-w-[160px]">
          {cssVar}
        </code>
        {figma ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60 shrink-0">
              F
            </span>
            <Swatch hex={figma.hex} />
            <span className="text-[11px] font-mono text-muted-foreground truncate">
              {figma.value}
            </span>
          </div>
        ) : (
          <span className="text-[11px] italic text-muted-foreground/40">
            not in Figma
          </span>
        )}
      </div>

      {/* Separator */}
      <div className="px-2 flex items-center justify-center w-8 shrink-0">
        {status === "sync" && (
          <span className="text-[13px] text-muted-foreground/40">=</span>
        )}
        {status === "drift" && (
          <span className="text-[13px] font-semibold text-amber-500">≠</span>
        )}
        {status === "missing" && (
          <span className="text-[13px] text-destructive">—</span>
        )}
        {status === "extra" && (
          <span className="text-[13px] text-muted-foreground/40">—</span>
        )}
      </div>

      {/* Code value */}
      <div className="flex items-center gap-1.5 min-w-0 pl-2">
        {code ? (
          <>
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60 shrink-0">
              C
            </span>
            <Swatch hex={code.hex} />
            <span
              className={cn(
                "text-[11px] font-mono truncate",
                status === "drift" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {code.value}
            </span>
          </>
        ) : (
          <span className="text-[11px] italic text-muted-foreground/30">
            not defined
          </span>
        )}
      </div>

      {/* Status badge */}
      <div className="pl-3 flex justify-end shrink-0">
        {status !== "sync" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10.5px] font-semibold",
              status === "drift" && "text-amber-500",
              status === "missing" && "text-destructive",
              status === "extra" && "text-muted-foreground"
            )}
          >
            {STATUS_ICON[status]}
            {STATUS_LABEL[status]}
          </span>
        )}
        {status === "sync" && (
          <span className="text-emerald-500">
            <CheckIcon className="size-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Summary pill ─────────────────────────────────────────────────────────────

const SummaryPill = ({
  status,
  count,
}: {
  status: DiffStatus;
  count: number;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tabular-nums",
      status === "sync" &&
        "border-emerald-500/20 bg-emerald-500/7 text-emerald-500",
      status === "drift" && "border-amber-500/25 bg-amber-500/7 text-amber-500",
      status === "missing" &&
        "border-destructive/20 bg-destructive/7 text-destructive",
      status === "extra" && "border-border text-muted-foreground"
    )}
  >
    <span className="size-1.5 rounded-full bg-current opacity-70" />
    {count} {STATUS_LABEL[status].toLowerCase()}
  </span>
);

// ─── FigmaDiffView ────────────────────────────────────────────────────────────

type FilterMode = "all" | "drift" | "missing";

export const FigmaDiffView = ({ data }: { data: DiffResult }) => {
  const [filter, setFilter] = useState<FilterMode>("all");

  const filtered = data.tokens.filter((t) =>
    filter === "all" ? true : t.status === filter
  );

  const categories = [...new Set(filtered.map((t) => t.category))];

  return (
    <div className="flex flex-col gap-0">
      {/* Summary */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 py-3 border-b border-border/50">
        <SummaryPill status="sync" count={data.summary.sync} />
        <SummaryPill status="drift" count={data.summary.drift} />
        <SummaryPill status="missing" count={data.summary.missing} />
        {data.summary.extra > 0 && (
          <SummaryPill status="extra" count={data.summary.extra} />
        )}
        <span className="ml-auto text-[11px] text-muted-foreground/60">
          {data.mode} · {data.figmaFile.slice(0, 8)}… ·{" "}
          {data.variablesAvailable
            ? "variables available"
            : "variables unavailable"}
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border/50">
        {(["all", "drift", "missing"] as FilterMode[]).map((f) => {
          const countByFilter: Record<FilterMode, number> = {
            all: data.summary.total,
            drift: data.summary.drift,
            missing: data.summary.missing,
          };
          const count = countByFilter[f];
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                filter === f
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}{" "}
              <span className="ml-0.5 text-[10px] opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Token list */}
      <div className="overflow-y-auto max-h-[340px]">
        {categories.map((cat) => {
          const rows = filtered.filter((t) => t.category === cat);
          if (rows.length === 0) {
            return null;
          }
          return (
            <div key={cat}>
              <div className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground border-b border-border/50">
                {CATEGORY_LABEL[cat]}
              </div>
              {rows.map((token) => (
                <TokenRow key={token.cssVar} token={token} />
              ))}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tokens match this filter.
          </div>
        )}
      </div>
    </div>
  );
};
