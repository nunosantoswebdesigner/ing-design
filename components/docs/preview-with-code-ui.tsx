"use client";

import { useState } from "react";

import { CopyButton } from "@/components/features/copy-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const PreviewWithCodeUI = ({
  children,
  code,
  highlightedCode,
  className,
}: {
  children: React.ReactNode;
  code: string;
  highlightedCode: string;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("mt-4 overflow-hidden rounded-xl border", className)}>
      <div className="flex min-h-87.5 items-center justify-center p-8">{children}</div>

      <div className="border-t">
        <div className={cn("relative", !isOpen && "max-h-50 overflow-hidden")}>
          <div className="relative [&_pre]:max-h-none [&_pre]:rounded-none [&_pre]:rounded-b-xl">
            <CopyButton value={code} event="copy_primitive_code" />
            <div dangerouslySetInnerHTML={{ __html: highlightedCode }} />
          </div>

          {!isOpen && (
            <div className="from-code/0 to-code absolute inset-x-0 bottom-0 flex h-28 items-end justify-center bg-linear-to-b pb-4">
              <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                View Code
              </Button>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="flex justify-center border-t py-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 text-xs"
              onClick={() => setIsOpen(false)}
            >
              Collapse
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
