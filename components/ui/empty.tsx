import * as React from "react";

import { cn } from "@/lib/utils";

const Empty = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="empty"
    className={cn("flex flex-col items-center justify-center gap-3 py-12 text-center", className)}
    {...props}
  />
);

const EmptyIcon = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="empty-icon"
    className={cn(
      "flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-6",
      className,
    )}
    {...props}
  />
);

const EmptyTitle = ({ className, ...props }: React.ComponentProps<"h3">) => (
  <h3
    data-slot="empty-title"
    className={cn("text-base font-semibold leading-none tracking-tight", className)}
    {...props}
  />
);

const EmptyDescription = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p
    data-slot="empty-description"
    className={cn("max-w-xs text-sm text-muted-foreground", className)}
    {...props}
  />
);

const EmptyAction = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="empty-action"
    className={cn("mt-1 flex flex-wrap items-center justify-center gap-2", className)}
    {...props}
  />
);

export { Empty, EmptyIcon, EmptyTitle, EmptyDescription, EmptyAction };
