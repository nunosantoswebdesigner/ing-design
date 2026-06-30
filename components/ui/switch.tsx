"use client";

import { Switch as SwitchPrimitive } from "radix-ui";

import { useFeedback } from "@/hooks/use-feedback";
import { cn } from "@/lib/utils";

const Switch = ({
  className,
  sounds,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  sounds?: boolean;
}) => {
  const playOn = useFeedback({ sound: sounds ? "toggleOn" : undefined });
  const playOff = useFeedback({ sound: sounds ? "toggleOff" : undefined });

  const handleCheckedChange = (checked: boolean) => {
    checked ? playOn() : playOff();
    onCheckedChange?.(checked);
  };

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      onCheckedChange={handleCheckedChange}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-[color,box-shadow,background-color] outline-none",
        "bg-input",
        "data-[state=checked]:bg-primary",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-background pointer-events-none block size-4 rounded-full shadow-sm ring-0 transition-transform",
          "data-[state=checked]:translate-x-4",
          "data-[state=unchecked]:translate-x-0",
        )}
      />
    </SwitchPrimitive.Root>
  );
};

export { Switch };
