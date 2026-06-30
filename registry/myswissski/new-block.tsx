"use client";

import { cn } from "@/lib/utils";

export interface NewBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add your props here
}

const NewBlock = ({ className, children, ...props }: NewBlockProps) => (
  <div data-slot="new-block" className={cn("flex flex-col gap-6 p-6", className)} {...props}>
    {children}
  </div>
);

NewBlock.displayName = "NewBlock";

export { NewBlock };
