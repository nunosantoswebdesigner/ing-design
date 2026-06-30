import * as React from "react";

import { cn } from "@/lib/utils";

const InputGroup = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="input-group"
    className={cn(
      "flex",
      // --- Input ---
      "[&>[data-slot=input]]:flex-1 [&>[data-slot=input]]:min-w-0",
      "[&>[data-slot=input]:not(:first-child)]:rounded-l-none",
      "[&>[data-slot=input]:not(:first-child)]:-ml-px",
      "[&>[data-slot=input]:not(:last-child)]:rounded-r-none",
      "[&>[data-slot=input]:focus-visible]:relative [&>[data-slot=input]:focus-visible]:z-10",
      // --- Button ---
      "[&>[data-slot=button]:not(:first-child)]:-ml-px",
      "[&>[data-slot=button]:not(:first-child)]:rounded-l-none",
      "[&>[data-slot=button]:not(:last-child)]:rounded-r-none",
      "[&>[data-slot=button]:focus-visible]:relative [&>[data-slot=button]:focus-visible]:z-10",
      className,
    )}
    {...props}
  />
);

const InputGroupText = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="input-group-text"
    className={cn(
      "border-input bg-muted text-muted-foreground flex items-center border px-3 text-sm whitespace-nowrap",
      "rounded-none first:rounded-l-md last:rounded-r-md",
      "not-first:-ml-px",
      "[&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  />
);

export { InputGroup, InputGroupText };
