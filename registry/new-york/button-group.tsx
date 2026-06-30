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
      // Make every direct Button child position:relative so z-index works
      "[&>[data-slot=button]]:relative",
      "[&>[data-slot=button]:hover]:z-10",
      "[&>[data-slot=button]:focus-visible]:z-10",
      orientation === "horizontal"
        ? [
            // Horizontal: clip radius on inner edges, overlap borders via -mr-px
            "[&>[data-slot=button]:first-child]:rounded-r-none",
            "[&>[data-slot=button]:last-child]:rounded-l-none",
            "[&>[data-slot=button]:not(:first-child):not(:last-child)]:rounded-none",
            "[&>[data-slot=button]:not(:last-child)]:-mr-px",
          ]
        : [
            // Vertical: clip radius on inner edges, overlap borders via -mb-px
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
