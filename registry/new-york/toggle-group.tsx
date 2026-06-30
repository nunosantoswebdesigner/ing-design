"use client";

import type { VariantProps } from "class-variance-authority";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { createContext, useContext } from "react";

import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type ToggleGroupContextValue = VariantProps<typeof toggleVariants>;

const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: "default",
  variant: "default",
});

const ToggleGroup = ({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) => (
  <ToggleGroupPrimitive.Root
    data-slot="toggle-group"
    className={cn("flex items-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ size, variant }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
);

const ToggleGroupItem = ({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) => {
  const ctx = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        toggleVariants({
          size: size ?? ctx.size,
          variant: variant ?? ctx.variant,
        }),
        "min-w-0",
        className,
      )}
      {...props}
    />
  );
};

export { ToggleGroup, ToggleGroupItem };
export default ToggleGroup;
