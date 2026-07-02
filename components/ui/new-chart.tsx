"use client";

import { cn } from "@/lib/utils";

export type NewChartProps = React.HTMLAttributes<HTMLDivElement>;

const NewChart = ({ className, children, ...props }: NewChartProps) => (
  <div data-slot="new-chart" className={cn("flex flex-col gap-6 p-6", className)} {...props}>
    {children}
  </div>
);

NewChart.displayName = "NewChart";

export { NewChart };
export default NewChart;
