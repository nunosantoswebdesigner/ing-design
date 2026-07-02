"use client";

import { SparklesIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef } from "react";

import { ComponentIcon } from "@/components/animated-icons/component";
import type { ComponentIconHandle } from "@/components/animated-icons/component";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const StartWithAiButton = () => (
  <Button asChild sound="click" className="px-4">
    <Link href={ROUTES.LLMS} transitionTypes={["nav-forward"]}>
      <SparklesIcon className="hidden sm:inline" />
      Start with AI
    </Link>
  </Button>
);

const BrowseComponentsButton = () => {
  const componentIconRef = useRef<ComponentIconHandle>(null);

  const handleMouseEnter = useCallback(() => {
    componentIconRef.current?.startAnimation();
  }, []);

  const handleMouseLeave = useCallback(() => {
    componentIconRef.current?.stopAnimation();
  }, []);

  return (
    <Button
      asChild
      variant="outline"
      sound="click"
      className="px-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={ROUTES.DOCS_COMPONENTS} transitionTypes={["nav-forward"]}>
        <ComponentIcon className="hidden sm:inline" ref={componentIconRef} size={22} />
        Browse Components
      </Link>
    </Button>
  );
};

export const HomeCtas = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
    <StartWithAiButton />
    <BrowseComponentsButton />
  </div>
);
