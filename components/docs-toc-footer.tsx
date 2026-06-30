"use client";

import { GithubIcon, XIcon } from "@/components/icons";
import { GITHUB, LINK } from "@/constants/links";
import { DOCS_DIR } from "@/lib/docs";
import { trackEvent } from "@/lib/events";
import { cn } from "@/lib/utils";

export const DocsTocFooter = ({ docId, className }: { docId: string; className?: string }) => (
  <div className={cn("flex flex-col gap-2", className)}>
    {docId && (
      <a
        href={`${LINK.GITHUB}/blob/${GITHUB.branch}/${DOCS_DIR}/${docId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors text-[0.8rem] hover:text-foreground text-muted-foreground [&_svg]:size-3 flex gap-1.5 items-center"
        onClick={() =>
          trackEvent({
            name: "click_view_code",
            properties: { doc: docId },
          })
        }
      >
        <GithubIcon />
        View code on GitHub
      </a>
    )}
    {LINK.X && (
      <a
        href={LINK.X}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors text-[0.8rem] hover:text-foreground text-muted-foreground [&_svg]:size-3 flex gap-1.5 items-center"
      >
        <XIcon />
        Follow on X
      </a>
    )}
  </div>
);
