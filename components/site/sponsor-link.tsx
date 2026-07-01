"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";

import type { HeartHandshakeIconHandle } from "@/components/animated-icons/heart-handshake";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export const SponsorLink = () => {
  const heartRef = useRef<HeartHandshakeIconHandle>(null);

  const handleMouseEnter = useCallback(() => {
    heartRef.current?.startAnimation();
  }, []);

  const handleMouseLeave = useCallback(() => {
    heartRef.current?.stopAnimation();
  }, []);

  return (
    <Button
      asChild
      size="sm"
      variant="ghost"
      sound="click"
      className="max-sm:size-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={ROUTES.HOME}>
        <div className="flex items-center gap-1">
          <img className="w-25px" src={"/favicon.svg"} />
          {/* <HeartHandshakeIcon className="text-pink-500" ref={heartRef} /> */}
          <div className="pt-1">
            <div className="max-sm:sr-only text-[x-small]" style={{ lineHeight: "8px" }}>
              ING
            </div>
            <div className="text-[xx-small]">design</div>
          </div>
        </div>
      </Link>
    </Button>
  );
};
