import { cn } from "@/lib/utils";

interface ButtonGroupProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical";
}

const ButtonGroup = ({ className, orientation = "horizontal", ...props }: ButtonGroupProps) => (
  <div
    data-slot="button-group"
    data-orientation={orientation}
    className={cn(
      "inline-flex",
      "[&>[data-slot=button]]:relative",
      "[&>[data-slot=button]:hover]:z-10",
      "[&>[data-slot=button]:focus-visible]:z-10",
      orientation === "horizontal"
        ? [
            "[&>[data-slot=button]:first-child]:rounded-r-none",
            "[&>[data-slot=button]:last-child]:rounded-l-none",
            "[&>[data-slot=button]:not(:first-child):not(:last-child)]:rounded-none",
            "[&>[data-slot=button]:not(:last-child)]:-mr-px",
          ]
        : [
            "flex-col",
            "[&>[data-slot=button]:first-child]:rounded-b-none",
            "[&>[data-slot=button]:last-child]:rounded-t-none",
            "[&>[data-slot=button]:not(:first-child):not(:last-child)]:rounded-none",
            "[&>[data-slot=button]:not(:last-child)]:-mb-px",
          ],
      className,
    )}
    {...props}
  />
);

export { ButtonGroup };
export type { ButtonGroupProps };
