"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ChevronProps } from "react-day-picker";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        caption_label: "text-sm font-medium",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-accent",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
          "[&:has([aria-selected].day-outside)]:bg-accent/50",
          "[&:has([aria-selected].range_end)]:rounded-r-md",
          "[&:has([aria-selected].range_start)]:rounded-l-md",
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100",
        ),
        disabled: "text-muted-foreground opacity-50",
        hidden: "invisible",
        month: "flex flex-col gap-4",
        month_caption: "relative flex items-center justify-center pt-1",
        month_grid: "w-full border-collapse",
        months: "flex flex-col gap-2 sm:flex-row",
        nav: "absolute inset-x-0 top-0 flex items-center justify-between gap-1 px-1 pt-1",
        outside:
          "day-outside text-muted-foreground opacity-50 [&>button]:aria-selected:text-muted-foreground",
        range_end:
          "range_end rounded-r-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        range_start:
          "range_start rounded-l-md [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        selected:
          "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
        today: "[&>button]:bg-accent [&>button]:text-accent-foreground",
        week: "mt-2 flex w-full",
        weekday: "text-muted-foreground w-8 rounded-md text-center text-[0.8rem] font-normal",
        weekdays: "flex",
        weeks: "",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }: ChevronProps) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";
export { Calendar };
