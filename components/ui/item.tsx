"use client";

import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const Item = ({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) => {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp data-slot="item" className={cn("flex items-center gap-3 py-2.5", className)} {...props} />
  );
};

const ItemIcon = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-icon"
    className={cn(
      "bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md",
      "[&_svg:not([class*='size-'])]:size-4",
      className,
    )}
    {...props}
  />
);

const ItemContent = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-content"
    className={cn("flex min-w-0 flex-1 flex-col", className)}
    {...props}
  />
);

const ItemLabel = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p
    data-slot="item-label"
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
);

const ItemDescription = ({ className, ...props }: React.ComponentProps<"p">) => (
  <p
    data-slot="item-description"
    className={cn("text-muted-foreground mt-1 truncate text-xs", className)}
    {...props}
  />
);

const ItemAction = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="item-action"
    className={cn("ml-auto flex shrink-0 items-center gap-1.5", className)}
    {...props}
  />
);

export { Item, ItemIcon, ItemContent, ItemLabel, ItemDescription, ItemAction };
export default Item;
