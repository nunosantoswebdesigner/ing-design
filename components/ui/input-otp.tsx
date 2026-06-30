"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const InputOTP = ({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
}) => (
  <OTPInput
    containerClassName={cn(
      "flex items-center gap-2 has-disabled:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
);

const InputOTPGroup = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div className={cn("flex items-center", className)} {...props} />
);

const InputOTPSlot = ({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & { index: number }) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  return (
    <div
      className={cn(
        "border-input relative flex h-9 w-9 items-center justify-center border-y border-r text-sm shadow-xs transition-all",
        "first:rounded-l-md first:border-l",
        "last:rounded-r-md",
        "aria-invalid:border-destructive",
        isActive && "border-ring ring-ring/50 z-10 ring-[3px]",
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
};

const InputOTPSeparator = ({ ...props }: React.ComponentProps<"div">) => (
  <div role="separator" {...props}>
    <MinusIcon />
  </div>
);

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
