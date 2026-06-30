import { cn } from "@/lib/utils";

export interface NewElementProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add your props here
}

const NewElement = ({ className, children, ...props }: NewElementProps) => (
  <div
    data-slot="new-element"
    className={cn("rounded-md border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
);

NewElement.displayName = "NewElement";

export { NewElement };
