"use client";

import { LayoutGrid, LayoutList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ComponentPageItem {
  name: ReactNode;
  url: string;
  description?: string;
}

const GridView = ({ pages }: { pages: ComponentPageItem[] }) => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-8 lg:gap-x-16 lg:gap-y-6 xl:gap-x-20">
    {pages.map((page) => (
      <Link
        key={page.url}
        className="inline-flex items-center gap-2 text-lg font-medium underline-offset-4 hover:underline md:text-base"
        href={page.url}
        transitionTypes={["nav-forward"]}
      >
        {page.name}
      </Link>
    ))}
  </div>
);

const ListView = ({ pages }: { pages: ComponentPageItem[] }) => (
  <div className="rounded-xl border divide-y overflow-hidden">
    {pages.map((page) => (
      <Link
        key={page.url}
        href={page.url}
        transitionTypes={["nav-forward"]}
        className="flex items-center justify-between px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors"
      >
        <code className="font-mono text-[0.8rem]">{page.name}</code>
        {page.description && (
          <span className="text-muted-foreground text-xs text-right max-w-xs hidden sm:block">
            {page.description}
          </span>
        )}
      </Link>
    ))}
  </div>
);

export const ComponentsListView = ({
  pages,
  className,
}: {
  pages: ComponentPageItem[];
  className?: string;
}) => {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex justify-end">
        <div className="flex items-center gap-1 rounded-md border p-0.5">
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-7", view === "grid" && "bg-muted text-foreground")}
            onClick={() => setView("grid")}
            aria-label="Grid view"
          >
            <LayoutGrid className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-7", view === "list" && "bg-muted text-foreground")}
            onClick={() => setView("list")}
            aria-label="List view"
          >
            <LayoutList className="size-3.5" />
          </Button>
        </div>
      </div>
      {view === "grid" ? <GridView pages={pages} /> : <ListView pages={pages} />}
    </div>
  );
};
