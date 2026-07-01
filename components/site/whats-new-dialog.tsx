"use client";

import { useEffect, useRef, useState } from "react";

import { ComponentIcon } from '@/components/animated-icons/component';
import type { ComponentIconHandle } from '@/components/animated-icons/component';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export const WhatsNewDialog = () => {
  const [presentationOpen, setPresentationOpen] = useState(false);
  const iconRef = useRef<ComponentIconHandle>(null);

  useEffect(() => {
    iconRef.current?.startAnimation();
  }, []);

  return (
    <>
      <div className="bg-card fixed right-6 bottom-6 z-40 w-80 rounded-lg border p-4 shadow-lg">
        <ComponentIcon className="text-primary mb-2" ref={iconRef} size={28} />
        <Badge className="mb-2" variant="secondary">
          v0.0.1
        </Badge>
        <p className="mb-1 font-semibold">What's new in ING Design</p>
        <p className="text-muted-foreground mb-3 text-sm">
          A multi-brand component registry, with a Figma Diff to keep design and code in sync, and
          one-click export to v0, ChatGPT, and Claude.
        </p>
        <Button className="w-full" onClick={() => setPresentationOpen(true)}>
          See the full proposal
        </Button>
      </div>

      <Dialog onOpenChange={setPresentationOpen} open={presentationOpen}>
        <DialogContent className="h-[calc(100vh-8rem)] w-[calc(100vw-8rem)] max-w-none gap-0 p-0 sm:max-w-none">
          <DialogTitle className="sr-only">ING Design — Adoption Proposal</DialogTitle>
          <iframe
            className="h-full w-full border-0"
            src="/whats-new.html"
            title="ING Design — Adoption Proposal"
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
