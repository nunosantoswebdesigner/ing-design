import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-current", {
  defaultVariants: {
    size: "default",
  },
  variants: {
    size: {
      default: "size-5",
      lg: "size-6",
      sm: "size-4",
      xl: "size-8",
    },
  },
});

const Spinner = ({
  className,
  size,
  label = "Loading…",
  ...props
}: React.ComponentProps<"svg"> &
  VariantProps<typeof spinnerVariants> & {
    label?: string;
  }) => (
  <svg
    data-slot="spinner"
    role="status"
    aria-label={label}
    viewBox="0 0 24 24"
    fill="none"
    className={cn(spinnerVariants({ size }), className)}
    {...props}
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export { Spinner, spinnerVariants };
export default Spinner;
