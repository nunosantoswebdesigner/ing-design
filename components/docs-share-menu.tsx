"use client";

import { LinkIcon } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

import { SITE } from "@/constants/site";
import { toast } from "sonner";

import type { ShareIconHandle } from "@/components/animated-icons/share";
import { ShareIcon } from "@/components/animated-icons/share";
import { DiscordIcon, XIcon } from "@/components/icons";
import { LINK } from "@/constants/links";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export const DocsShareMenu = ({
  url,
  title,
  description,
}: {
  url: string;
  title?: string;
  description?: string;
}) => {
  const shareIconRef = useRef<ShareIconHandle>(null);
  const { copyToClipboard } = useCopyToClipboard();
  const [posting, setPosting] = useState(false);

  const absoluteUrl = useMemo(() => {
    if (url.startsWith("http")) {
      return url;
    }
    return `${SITE.URL}${url.startsWith("/") ? url : `/${url}`}`;
  }, [url]);

  const handleMouseEnter = useCallback(() => {
    shareIconRef.current?.startAnimation();
  }, []);

  const handleMouseLeave = useCallback(() => {
    shareIconRef.current?.stopAnimation();
  }, []);

  const urlEncoded = encodeURIComponent(absoluteUrl);

  const handlePostToDiscord = useCallback(async () => {
    if (posting) {
      return;
    }
    setPosting(true);

    const share = fetch("/api/share/discord", {
      body: JSON.stringify({ description, title, url: absoluteUrl }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Failed (${res.status})`);
      }
    });

    toast.promise(share, {
      error: (err: Error) => err.message ?? "Something went wrong",
      loading: "Sharing to Discord…",
      success: "Posted to Discord!",
    });

    share.finally(() => setPosting(false));
  }, [posting, title, description, absoluteUrl]);

  return (
    <DropdownMenu sounds>
      <DropdownMenuTrigger asChild>
        <Button
          className="hidden sm:flex size-7 border-none active:scale-none"
          variant="secondary"
          size="icon-sm"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ShareIcon ref={shareIconRef} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-fit"
        alignOffset={-6}
        collisionPadding={8}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem
          sound="copy"
          onClick={() => {
            copyToClipboard(absoluteUrl);
            toast.success("Link copied");
          }}
        >
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        {LINK.X && (
          <DropdownMenuItem asChild sound="click">
            <a href={`https://x.com/intent/tweet?url=${urlEncoded}`} target="_blank" rel="noopener">
              <XIcon />
              Share on X
            </a>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem sound="click" disabled={posting} onClick={handlePostToDiscord}>
          <DiscordIcon />
          {posting ? "Posting…" : "Share on Discord"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
