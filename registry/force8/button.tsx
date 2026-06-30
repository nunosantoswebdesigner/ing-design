import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-xs font-bold uppercase tracking-widest transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50 aria-invalid:border-destructive",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-9 px-5 py-2 has-[>svg]:px-4",
        icon: "size-9",
        "icon-lg": "size-10",
        "icon-sm": "size-8",
        lg: "h-10 rounded-sm px-8 has-[>svg]:px-6",
        sm: "h-8 rounded-sm gap-1.5 px-4 has-[>svg]:px-3",
      },
      variant: {
        default:
          "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-200 dark:shadow-orange-950/50",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        ghost:
          "hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/30 dark:hover:text-orange-300",
        link: "text-orange-500 underline-offset-4 hover:underline",
        outline:
          "border-2 border-orange-500 bg-transparent text-orange-600 hover:bg-orange-500 hover:text-white dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400 dark:hover:text-black",
        secondary:
          "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:hover:bg-orange-950",
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
