"use client";

import { Button } from "@/components/ui/button";

interface ExternalLinkButtonProps
  extends React.ComponentProps<typeof Button> {
  href: string;
}

export const ExternalLinkButton = ({
  href,
  children,
  ...props
}: ExternalLinkButtonProps) => (
  <Button sound="click" asChild {...props}>
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  </Button>
);
