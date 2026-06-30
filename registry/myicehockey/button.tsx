import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-black tracking-tight transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 aria-invalid:border-destructive",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",
        "icon-lg": "size-10",
        "icon-sm": "size-8",
        lg: "h-10 px-6 has-[>svg]:px-4",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
      },
      variant: {
        default:
          "bg-blue-700 text-white hover:bg-blue-900 shadow-lg shadow-blue-900/20",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        ghost:
          "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300",
        link: "text-blue-600 underline-offset-4 hover:underline",
        outline:
          "border-2 border-blue-700 bg-transparent text-blue-700 hover:bg-blue-700 hover:text-white dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white",
        secondary:
          "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-950",
      },
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-size={size}
      data-variant={variant}
      className={cn(buttonVariants({ className, size, variant }))}
      {...props}
    />
  );
};

export { Button, buttonVariants };
