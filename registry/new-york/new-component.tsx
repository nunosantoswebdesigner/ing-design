import { cn } from "@/lib/utils";

export interface NewComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add your props here
}

const NewComponent = ({ className, children, ...props }: NewComponentProps) => (
  <div
    className={cn("rounded-md border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  >
    {children}
  </div>
);

NewComponent.displayName = "NewComponent";

export { NewComponent };
export default NewComponent;
